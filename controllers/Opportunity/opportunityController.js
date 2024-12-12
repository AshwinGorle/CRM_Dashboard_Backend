
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { errors } from "../../utils/responseMessages.js";
import {
  updateTotalRevenueAndSales,
  validateOpportunityId,
} from "../../utils/opportunity.utils.js";

import RevenueController from "./revenueController.js";
import { checkForLifetimeValueAndUpdate } from "../../utils/client.utils.js";
import {
  getFilterOptions,
  getSortingOptions,
} from "../../utils/searchOptions.js";
import StageHistoryController from "../History/stageHistoryController.js";
import SalesStageController from "../Stage/salesStageController.js";
import SalesSubStageController from "../Stage/salesSubStageController.js";
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
      if (!projectName || !stageClarification) {
        return res.status(400).json({
          status: "failed",
          message: "All required fields must be filled",
        });
      }

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
      await validateOpportunityId(req.body, newOpportunity);

      //handling revenues
      if (revenue) {
        await RevenueController.handleRevenue(revenue, newOpportunity, session);
      }
      await newOpportunity.save({ session });

      // After Inserting Revenue re-calculation expected Sales
      newOpportunity = await OpportunityMasterModel.findById(newOpportunity._id)
        .populate("revenue")
        .session(session);
      updateTotalRevenueAndSales(newOpportunity);
      console.log(
        "opportunity after expected sales calculation ",
        newOpportunity
      );
      await newOpportunity.save({ session });

      // It will update the LifeTime Value field of client hence no changes to save in this new opportunity
      if (newOpportunity.client)
        await checkForLifetimeValueAndUpdate(newOpportunity.client, session);

      // Managing Sales Stage History
      const newStageHistoryId_ = await StageHistoryController.createInitialHistory( newOpportunity._id,  newOpportunity.entryDate, session);
      newOpportunity.stageHistory.push(newStageHistoryId_);
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
    console.log("opportunities ", opportunities)

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
      console.log("updated op data : -----", updateData);
     
      let opportunity = await OpportunityMasterModel.findById(id).session(session);
      if (!opportunity) throw new ServerError("Update Opportunity", errors.opportunity.NOT_FOUND);

      // await validateOpportunityId(updateData, opportunity);
      Object.keys(updateData).forEach((key) => {
        if (key != "revenue") opportunity[key] = updateData[key];
      });

      // If Update contains stage change
      if(updateData.salesStage){
        console.log("Entering in stage change");
        const updateDate  = updateData.updateDate ? new Date(updateData.updateDate) : Date.now();
        await SalesStageController.handleStageChange(updateData.salesStage, opportunity._id,  updateDate, session )
      }
      
      const updateDate  = updateData.updateDate ? new Date(updateData.updateDate) : Date.now();
      if(updateData.salesSubStage){
        console.log("Entering in sub stage change");
        const updateDate  = updateData.updateDate ? new Date(updateData.updateDate) : Date.now();
        await SalesSubStageController.handleSubStageChange(updateData.salesSubStage, opportunity._id, updateDate, session)
      }
      
      // if the substage is won then have to close the opportunity
      const wonSubStageId = "670e81150a2c8e8563f16b55"  // only yha ye id string me chahiye !! 
      if(updateData.salesSubStage == wonSubStageId ) opportunity.closingDate = updateDate
      
      // If update contains revenue handle it
      if (updateData.revenue) {
        await RevenueController.handleRevenue(
          updateData.revenue,
          opportunity,
          session
        );
      }
      await opportunity.save({ session });
      console.log("opportunity after save", opportunity);

      //Updating revenue and sales 
      let updatedOpportunity = await OpportunityMasterModel.findById(
        opportunity._id
      )
        .populate("revenue")
        .session(session);

      if(updateData.revenue){
        updateTotalRevenueAndSales(updatedOpportunity);
        await updatedOpportunity.save({ session });
      }
      
      // If Update contains client then have to re calculate the client's lifetime value
      if (updatedOpportunity.client)
        await checkForLifetimeValueAndUpdate(
          updatedOpportunity.client,
          session
      );


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
        await checkForLifetimeValueAndUpdate(opportunity.client, session);
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
