
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { ClientError, ServerError } from "../../utils/customErrorHandler.utils.js";
import { errors } from "../../utils/responseMessages.js";

import RevenueController from "./revenueController.js";
import {
  getFilterOptions,
  getSortingOptions,
} from "../../utils/searchOptions.js";
import StageHistoryController from "../History/stageHistoryController.js";
import SalesStageController from "../Stage/salesStageController.js";
import SalesSubStageController from "../Stage/salesSubStageController.js";
import { getOpportunityIdWithoutClient, updateTotalRevenueAndExpectedSales } from "../../service/client/opportunityService.js";
import { updateLifeTimeValueOfClient } from "../../service/client/clientService.js";
import { fetchWonStage } from "../../service/client/systemService.js";
class OpportunityController {
  static createOpportunity = catchAsyncError(
    async (req, res, next, session) => {
      let {
        entryDate,
        enteredBy = req.user._id,
        client,
        partneredWith,
        projectName,
        associatedTender,
        solution,
        subSolution,
        salesChamp,
        salesStage,
        salesSubStage,
        stageClarification,
        salesTopLine,
        offsets,
        revenue,
        expectedWonDate,
        confidenceLevel
      } = req.body;
      // Validate required fields
      console.log("revenue from frontend :  ", revenue);
      if (!projectName|| !stageClarification) throw new ClientError("requiredFields"," Project Name & Stage Clarification is Required!")
      if (!client) throw new ClientError("requiredFields","Client is Required!")

      // Manual validation for entryDate
      entryDate = new Date(entryDate);
      if (isNaN(entryDate.getTime())) {
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid entryDate" });
      }
      
      let newOpportunity = new OpportunityMasterModel({
        entryDate,
        enteredBy,
        client,
        partneredWith,
        projectName,
        associatedTender,
        solution,
        subSolution,
        salesChamp,
        salesStage,
        salesSubStage,
        stageClarification,
        salesTopLine,
        offsets,
        confidenceLevel,
        expectedWonDate
      });

      //generating customId for Opp.
      newOpportunity.customId = await getOpportunityIdWithoutClient(client)

      //Parse the revenues into opportunity revenue field formate
      if (revenue) await RevenueController.handleRevenue(revenue, newOpportunity, session);
      
      //Save the Opportunity Before Updating clients revenue and expected sales 
      await newOpportunity.save({ session });

      // After Inserting Revenue re-calculation expected Sales
      newOpportunity = await OpportunityMasterModel.findById(newOpportunity._id).populate("revenue").session(session);
      updateTotalRevenueAndExpectedSales(newOpportunity);
      console.log("opportunity expected sales and totalRevenue", newOpportunity.expectedSales, newOpportunity.totalRevenue);
      
      // Save opportunity as all updates related to opportunity is done
      await newOpportunity.save({ session });

      // It will update the LifeTime Value of client associated with the opportunity
      await updateLifeTimeValueOfClient(newOpportunity.client, session);
      
      // Managing Sales Stage History
      const newStageHistoryId = await StageHistoryController.createInitialHistory( newOpportunity._id,  newOpportunity.entryDate, session);
      newOpportunity.stageHistory.push(newStageHistoryId);
      await newOpportunity.save({session});

      return res.status(201).json({
        status: "success",
        message: "Opportunity created successfully",
        data: newOpportunity,
      });
    },
    true
  );

  static getAllOpportunities = catchAsyncError(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const filterOptions = getFilterOptions(req.query);
    const sortingOptions = getSortingOptions(req.query);
    const { config } = req.query;


    if (config === "true") {
      const opportunities = await OpportunityMasterModel.find().select("customId");
      return res.send({
        status: "success",
        message: "Config opportunities fetched successfully",
        data: { config: true, opportunities },
      });
    }
    

    const totalCount = await OpportunityMasterModel.countDocuments(
      filterOptions
    );

    const opportunities = await OpportunityMasterModel.find(filterOptions)
      .sort(sortingOptions)
      .limit(limit)
      .skip(skip)
      .populate("enteredBy")
      .populate("associatedTender")
      .populate("solution")
      .populate("subSolution")
      .populate("salesChamp")
      .populate("salesStage")
      .populate("salesSubStage")
      .populate("revenue")
      .populate("client");

    // const updatedOpportunities = opportunities.map((opportunity) => {
    //   const plainOpportunity = opportunity.toObject(); // Convert to plain object
    //   const totalRevenue = plainOpportunity.revenue.reduce(
    //     (accumulator, current) => {
    //       return (
    //         accumulator + current.Q1 + current.Q2 + current.Q3 + current.Q4
    //       );
    //     },
    //     0
    //   );
    //   const expectedSales =
    //     totalRevenue * (plainOpportunity.confidenceLevel / 100);
    //   return {
    //     ...plainOpportunity,
    //     totalRevenue,
    //     expectedSales,
    //   };
    // });
    // console.log("opportunities ", opportunities)

    return res.send({
      status: "success",
      message: "All Opportunities retrieved successfully",
      data: { page, limit, totalCount, opportunities: opportunities },
    });
   
  });

  static getOpportunityById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let opportunity = await OpportunityMasterModel.findById(id)
      // .populate("enteredBy")
      // .populate("associatedTender")
      .populate("solution")
      .populate("subSolution")
      // .populate("salesChamp")
      .populate("salesStage")
      .populate("salesSubStage")
      .populate("revenue")
      .populate("stageHistory")
      .populate({
        path: "stageHistory",
        populate: [
          { path: "stage" }, // Populate the stage inside stageHistory
          {
            path: "subStageHistory",
            populate: { path: "subStage" } // Populate subStage inside subStageHistory
          }
        ]
      })
      .exec();
    // .populate("client");

    if (!opportunity) throw new ServerError("NotFound", "Opportunity");

    res.status(200).json({
      status: "success",
      message: "Opportunity retrieved successfully",
      data: opportunity,
    });
  });

  static updateOpportunity = catchAsyncError(
    async (req, res, next, session) => {
      const { id } = req.params;
      let updateData = req.body;
      console.log("updated opportunity req : -----", updateData);
      let previousClient = null // to keep tract of client change
     
      let opportunity = await OpportunityMasterModel.findById(id).session(session);
      if (!opportunity) throw new ServerError("Update Opportunity", errors.opportunity.NOT_FOUND);

      // validating updateDate
      const updateDate  = updateData.updateDate ? new Date(updateData.updateDate) : Date.now();
      
      // if client is changed have to revert the lifeTime value of previous Client
      if(updateData.client) previousClient = opportunity.client._id;

      //updating directly updatable fields
      Object.keys(updateData).forEach((key) => {
        if (key != "revenue") opportunity[key] = updateData[key];
      });
      
      //if updateData contains client then have to change the opportunity customId
      if(updateData.client) opportunity.customId = await getOpportunityIdWithoutClient(updateData.client);

      // If Update contains stage change
      if(updateData.salesStage){
        console.log("Entering in sales stage change :");
        const updateDate  = updateData.updateDate ? new Date(updateData.updateDate) : Date.now();
        await SalesStageController.handleStageChange(updateData.salesStage, opportunity._id,  updateDate, session )
      }

      // Handle sales subStage change
      if(updateData.salesSubStage){
        console.log("Entering in sub stage change :");
        const updateDate  = updateData.updateDate ? new Date(updateData.updateDate) : Date.now();
        await SalesSubStageController.handleSubStageChange(updateData.salesSubStage, opportunity._id, updateDate, session)
      }
      
      // if the substage is won then have to close the opportunity
      const wonSubStageId = await fetchWonStage();  // only yha ye id string me chahiye !! 
      if(updateData?.salesSubStage?.toString() == wonSubStageId?.toString()) opportunity.closingDate = updateDate
      
      // If update contains revenue handle it
      if (updateData.revenue) {
        await RevenueController.handleRevenue(
          updateData.revenue,
          opportunity,
          session
        );
      }

      // All changes related to opportunity is done
      await opportunity.save({ session });

      //Updating revenue and sales 
      let updatedOpportunity = await OpportunityMasterModel.findById(
        opportunity._id
      )
        .populate("revenue")
        .session(session);

      if(updateData.revenue){
        updateTotalRevenueAndExpectedSales(updatedOpportunity);
        await updatedOpportunity.save({ session });
      }
      
      // If Update contains client then have to re calculate the client's lifetime value
      if (updatedOpportunity.client)
        await updateLifeTimeValueOfClient(
          updatedOpportunity.client,
          session
      );

      // Updating previous client lifeTime Value
      if(previousClient){
        await updateLifeTimeValueOfClient(
          previousClient,
          session
         );
      }

      // if opportunity is in final stage we will update lifeTime value of associated client
      console.log("sales sub stage : ", updatedOpportunity.salesSubStage)
      if(updatedOpportunity.salesSubStage.toString() == wonSubStageId){
        console.log("updating lifeTime value of client : ")
        await updateLifeTimeValueOfClient(
         updatedOpportunity.client,
          session
        );
      }

      res.status(200).json({
        status: "success",
        message: "Opportunity updated successfully",
        data: updatedOpportunity,
      });
    },
    true
  );

  static deleteOpportunity = catchAsyncError(
    async (req, res, next, session) => {
      const { id } = req.params;

      const opportunity = await OpportunityMasterModel.findByIdAndDelete(
        id
      ).session(session);
      if (opportunity.client)
        await updateLifeTimeValueOfClient(opportunity.client, session);
      res.status(200).json({
        status: "success",
        message: "Opportunity deleted successfully",
        data: opportunity,
      });
    },
    true
  );
}

export default OpportunityController;
