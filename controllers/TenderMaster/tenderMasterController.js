import TenderMasterModel from "../../models/TenderMasterModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import {
  ClientError,
  ServerError,
} from "../../utils/customErrorHandler.utils.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import mongoose from "mongoose";
import { checkForSubmissionDate, checkForTenderId } from "../../utils/tender.utils.js";
import { getFilterOptions, getSortingOptions } from "../../utils/searchOptions.js";
class TenderMasterController {
  // Create a new TenderMaster entry
 

  static createTenderMaster = catchAsyncError(async (req, res, next) => {
    const {
      rfpDate,
      entryDate,
      enteredBy = req.user._id,
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
    } = req.body;

    // Validate required fields
    if (!rfpDate || !entryDate || !enteredBy)
      throw new ClientError("AllRequired");

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
      stageExplanation
    });
    if(newTender.stage) newTender.submissionDate =  await checkForSubmissionDate(newTender.stage); // handling submission date
    if (client) newTender.customId =  await checkForTenderId(client)  // handling custom tender Id

    // Save the instance
    console.log("newTender before save : ", newTender)
    await newTender.save();
    console.log("newTender after save : ", newTender)
    
    res.status(201).json({
      status: "success",
      message: "Tender created successfully",
      data: newTender,
    });
  });

  // Get all TenderMaster entries
  static getAllTenderMasters = catchAsyncError(async (req, res, next) => {
    const { page = 1, limit = 12, config = false} = req.query;
    const  skip = (page - 1) * limit 
    const filterOptions = getFilterOptions(req.query);
    const sortingOptions = getSortingOptions(req.query);
    const  totalCount = await TenderMasterModel.countDocuments(filterOptions);
    if(config === "true"){
      const tenders = await TenderMasterModel.find().select("customId");
      return res.send({status : "success", message : "Config Tender fetched successfully", data : { config : true ,  tenders }});
    }
    const tenderMasters = await TenderMasterModel.find(filterOptions).sort(sortingOptions)
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
      data: {page, limit, totalCount, tenders : tenderMasters}
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
  static updateTenderMaster = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    let updateData = req.body;
    console.log("updating dat", updateData)
    const tenderMaster = await TenderMasterModel.findById(id);
    if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");
    if(updateData.stage) tenderMaster.submissionDate =  await checkForSubmissionDate(updateData.stage); // handling submission date
    if (updateData.client && !tenderMaster.customId) updateData['customId'] =  await checkForTenderId(updateData.client)  // handling tender Id
  
    Object.keys(updateData).forEach((key) => {
      if(key != "submissionDate")
      tenderMaster[key] = updateData[key];
    });
    
    
    const updatedTenderMaster = await tenderMaster.save();

    res.status(200).json({
      status: "success",
      message: "Tender updated successfully",
      data: updatedTenderMaster,
    });
  });

  // Delete a TenderMaster by ID
  static deleteTenderMaster = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const tenderMaster = await TenderMasterModel.findByIdAndDelete(id);
    if (!tenderMaster) throw new ServerError("NotFound", "TenderMaster");

    res.status(200).json({
      status: "success",
      message: "Tender deleted successfully",
      data: tenderMaster,
    });
  });
}

export default TenderMasterController;
