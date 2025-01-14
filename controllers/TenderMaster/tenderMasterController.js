import TenderMasterModel from "../../models/TenderMasterModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import {
  ClientError,
  ServerError,
} from "../../utils/customErrorHandler.utils.js";
import { checkForSubmissionDate } from "../../utils/tender.utils.js";
import {
  getFilterOptions,
  getSortingOptions,
} from "../../utils/searchOptions.js";
import {
  getTender,
  getTenderIdWithoutClient,
} from "../../service/tenderService.js";
import {
  getOpportunity,
  updateAssociatedTenderInOpportunity,
} from "../../service/opportunityService.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
class TenderMasterController {
  // Create a new TenderMaster entry

  static createTenderMaster = catchAsyncError(
    async (req, res, next, session) => {
      let {
        rfpDate,
        entryDate,
        enteredBy = req.user._id,
        submissionDueDate,
        client = null,
        reference,
        rfpTitle,
        rfpSource,
        associatedOpportunity,
        bond,
        bondValue,
        bondIssueDate,
        bondExpiry,
        submissionMode,
        evaluationDate,
        officer,
        bidManager,
        stage,
        stageExplanation,
      } = req.body;

      // Validate required fields
      if (!rfpDate || !entryDate || !enteredBy)
        throw new ClientError("AllRequired");

      // Validate client
      // if(!client) throw new ServerError('Not found', "Client is required!");

      // checking opportunity and if exists then we will replace the client with the client inside opportunity
      if (associatedOpportunity) {
        let opportunity = await OpportunityMasterModel.findById(
          associatedOpportunity
        );
        if (!opportunity)
          throw new ServerError("invalid or deleted opportunity!");
        client = opportunity.client.toString();
      }

      // Create a new instance of the TenderMasterModel
      const newTender = new TenderMasterModel({
        rfpDate,
        entryDate,
        enteredBy,
        submissionDueDate,
        client,
        reference,
        rfpTitle,
        rfpSource,
        associatedOpportunity,
        bond,
        bondValue,
        bondIssueDate,
        bondExpiry,
        submissionMode,
        evaluationDate,
        officer,
        bidManager,
        stage,
        stageExplanation,
      });

      // if tender stage is submitted we have to update submission date else set it null
      if (newTender.stage)
        newTender.submissionDate = await checkForSubmissionDate(
          newTender.stage
        );

      // Handle tender customId generation
      if (client) newTender.customId = await getTenderIdWithoutClient(client); // handling custom tender Id

      // Save the instance
      await newTender.save({ session });

      //We have to put this tender in corresponding opportunity
      if (newTender.associatedOpportunity) {
        const opportunityId = newTender.associatedOpportunity;
        const tenderId = newTender._id.toString();

        // send this in response for redux
        const opportunity = await updateAssociatedTenderInOpportunity(
          opportunityId,
          tenderId,
          session
        );
      }

      res.status(201).json({
        status: "success",
        message: "Tender created successfully",
        data: newTender,
      });
    },
    true
  );

  // Get all TenderMaster entriesA
  static getAllTenderMasters = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 12, config = false } = req.query;
    const skip = (page - 1) * limit;
    const filterOptions = getFilterOptions(req.query);
    const sortingOptions = getSortingOptions(req.query);
    const totalCount = await TenderMasterModel.countDocuments(filterOptions);
    if (config === "true") {
      const tenders = await TenderMasterModel.find().select("customId");
      return res.send({
        status: "success",
        message: "Config Tender fetched successfully",
        data: { config: true, tenders },
      });
    }
    const tenderMasters = await TenderMasterModel.find(filterOptions)
      .sort(sortingOptions)
      .limit(limit)
      .skip(skip)
      .populate("enteredBy")
      .populate("client")
      .populate("associatedOpportunity")
      .populate("officer")
      .populate("bidManager")
      .populate("stage");

    res.status(200).json({
      status: "success",
      message: "All Tenders retrieved successfully",
      data: { page, limit, totalCount, tenders: tenderMasters },
    });
  });

  // Get a TenderMaster by ID
  static getTenderMasterById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const tenderMaster = await TenderMasterModel.findById(id)
      // .populate("enteredBy")
      // .populate("client")
      // .populate("associatedOpportunity")
      // .populate("officer")
      // .populate("bidManager")
      .populate("stage");

    if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");

    res.status(200).json({
      status: "success",
      message: "Tender retrieved successfully",
      data: tenderMaster,
    });
  });

  // Update a TenderMaster by ID
  static updateTenderMaster = catchAsyncError(
    async (req, res, next, session) => {
      const { id } = req.params;
      let updateData = req.body;
      if(!id) throw new ServerError("Tender id is required to update tender")
      console.log("updating tender req :", updateData);

      const tenderMaster = await TenderMasterModel.findById(id);
      if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");

      //for later use if opportunity is updated while updating tender
      let opportunity;

      // checking for submission date
      if (updateData.stage)
          tenderMaster.submissionDate = await checkForSubmissionDate(
          updateData.stage
        ); // handling submission date

      // if client changed in tender we have to update the tender's customId
      if (updateData.client)
        updateData["customId"] = await getTenderIdWithoutClient(
          updateData.client
        ); // handling tender Id

      Object.keys(updateData).forEach((key) => {
        if (key != "submissionDate") tenderMaster[key] = updateData[key];
      });

      // if tender contains associatedOpportunity then update the opportunity associatedTender
      if (updateData.associatedOpportunity) {
        const tenderId = id;
        const opportunityId = updateData.associatedOpportunity;
        opportunity = await updateAssociatedTenderInOpportunity(
          opportunityId,
          tenderId,
          session
        );
        // send this opportunity in response while maintaining redux
      }

      const updatedTenderMaster = await tenderMaster.save({ session });

      res.status(200).json({
        status: "success",
        message: "Tender updated successfully",
        data: updatedTenderMaster,
      });
    },
    true
  );

  // Delete a TenderMaster by ID
  static deleteTenderMaster = catchAsyncError(
    async (req, res, next, session) => {
      const { id } = req.params;
      let { confirm } = req.query;
      confirm = confirm == "true" ? true : false;
      if (!id) throw new ServerError("To delete tender id is required");
  
      // Fetch the tender only if confirmation is not provided
      if (!confirm) {
        const tender = await TenderMasterModel.findById(id).populate({
          path: "associatedOpportunity",
          populate: [
            { path: "enteredBy", select: "firstName lastName avatar" },
            { path: "solution" },
            { path: "subSolution" },
            { path: "salesStage" },
            { path: "salesSubStage" },
            { path: "client", select: "name avatar" },
            { path: "salesChamp", select: "firstName lastName avatar" },
          ],
        })
        .populate('stage')
        .populate('bidManager', "firstName lastName avatar")
        .populate('enteredBy', "firstName lastName avatar")
        .populate('officer', "firstName lastName avatar");

        if(!tender) throw new ClientError("NotFound","Tender not found!")
  
        return res.status(200).json({
          status: "success",
          message: "Tender and related entries fetched successfully",
          data: { tender: tender, confirm: confirm },
        });
      } 
  
      // Deleting the tender if confirm is true
      let opportunity = null;
      const deletedTender = await TenderMasterModel.findByIdAndDelete(id).session(session);
      if (!deletedTender) throw new ServerError("Tender not found");
  
      // Remove the tender from the associated opportunity
      if (deletedTender?.associatedOpportunity) {
        opportunity = await OpportunityMasterModel.findById(deletedTender?.associatedOpportunity)
          .populate("enteredBy")
          .populate("associatedTender")
          .populate("solution")
          .populate("subSolution")
          .populate("salesChamp")
          .populate("salesStage")
          .populate("salesSubStage")
          .populate("revenue")
          .populate("client")
          .session(session);
        if (opportunity) {
          opportunity.associatedTender = null;
          await opportunity.save({ session });
        }
      }
  
      // Ensure we don't return the session object which could lead to circular structure
      const responseData = {
        tender: deletedTender ? deletedTender.toObject() : null, // Convert to plain object
        opportunity: opportunity ? opportunity.toObject() : null, // Convert to plain object
        confirm: confirm,
      };
  
      res.status(200).json({
        status: "success",
        message: "Tender and related entries updated successfully",
        data: responseData,
        confirm
      });
    },
    true
  );
  
}

export default TenderMasterController;
