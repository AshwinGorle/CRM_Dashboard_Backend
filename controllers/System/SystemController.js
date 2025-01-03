import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import TenderStageModel from "../../models/ConfigModels/TenderMaster/TenderStageModel.js";
import {
  ClientError,
  ServerError,
} from "../../utils/customErrorHandler.utils.js";
import SystemModel from "../../models/SystemModel.js";
import SalesSubStageModel from "../../models/StageModels/SalesSubStage.js";

class SystemController {
  static getSystemConfig = catchAsyncError(async (req, res) => {
    const systemConfig = await SystemModel.findOne({});
    if (!systemConfig)
      throw new ClientError("NOT_FOUND", "Please Set System config first");
    res.status(200).json({
      status: "success",
      message: "Won Stage fetched successfully!",
      data: systemConfig,
    });
  });

  static updateSystemConfig = catchAsyncError(async (req, res) => {
    let salesStage = null;
    let tenderStage = null;

    // Extract fields from the request body
    const { wonStage, tenderSubmittedStage } = req.body;
    console.log("data from frontend : ", req.body)

    // Ensure at least one field is provided
    if (!wonStage && !tenderSubmittedStage) {
        throw new ServerError("REQUIRED_FIELD", "Nothing to update!");
    }

    // Validate `wonStage` if provided
    if (wonStage) {
        salesStage = await SalesSubStageModel.findById(wonStage);
        if (!salesStage) {
            throw new ClientError(
                "NOT_FOUND",
                "Please provide a valid sales sub stage to set as won stage"
            );
        }
    }

    // Validate `tenderSubmittedStage` if provided
    if (tenderSubmittedStage) {
        tenderStage = await TenderStageModel.findById(tenderSubmittedStage);
        if (!tenderStage) {
            throw new ClientError(
                "NOT_FOUND",
                "This tender stage does not exist"
            );
        }
    }

    // Prepare the update object based on provided fields
    const updateData = {};
    if (wonStage) updateData.wonStage = wonStage;
    if (tenderSubmittedStage) updateData.tenderSubmittedStage = tenderSubmittedStage;
    
    console.log("updateData : ", updateData)
    // Find and update the single SystemConfig document
    const systemConfig = await SystemModel.findOneAndUpdate(
        {}, // Empty filter to ensure only one document is targeted
        { $set: updateData }, // Update only provided fields
        { upsert: true, new: true } // Create if not exists, return updated document
    );

    // Send response
    return res.status(200).json({
        status: "success",
        message: "System config updated successfully!",
        data: systemConfig,
    });
});

  // Update the wonStage field in the System document
  static updateWonStage = catchAsyncError(async (req, res) => {
    // Validations
    const { wonStage } = req.body;
    console.log("stage id in won update : ", wonStage);
    if (!wonStage)
      throw new ClientError("requiredField", "Sales sub stage id is required!");
    const salesStage = await SalesSubStageModel.findById(wonStage);
    console.log("salesStage", salesStage);
    if (!salesStage)
      throw new ClientError(
        "NOT_FOUND",
        "Please Provide valid sales sub stage to set as won stage"
      );

    // Find and update the single System document
    const systemConfig = await SystemModel.findOneAndUpdate(
      {}, // No filter to ensure only one document
      { $set: { wonStage } }, // Update wonStage field
      { upsert: true, new: true } // Create if not exists, return updated document
    );

    return res.status(200).json({
      status: "success",
      message: "System config updated successfully!",
      data: systemConfig,
    });
  });

  // Get the wonStage field from the System document
  static getWonStage = catchAsyncError(async (req, res) => {
    const systemConfig = await SystemModel.findOne({});
    if (!systemConfig || !systemConfig.wonStage)
      throw new ClientError("NOT_FOUND", "Please Set System config first");
    res.status(200).json({
      status: "success",
      message: "Won Stage fetched successfully!",
      data: systemConfig.wonStage,
    });
  });

  // Update the tenderSubmittedStage field in the System document
  static updateSubmittedTenderStage = catchAsyncError(async (req, res) => {
    const { tenderSubmittedStage } = req.body;

    if (!tenderSubmittedStage)
      throw new ClientError("requiredField", "Tender id is required");
    const tender = await TenderStageModel.findById(tenderSubmittedStage);
    if (!tender) throw new ClientError("NOT_FOUND", "");
    // Find and update the single System document
    const systemConfig = await SystemModel.findOneAndUpdate(
      {}, // No filter to ensure only one document
      { $set: { tenderSubmittedStage } }, // Update tenderSubmittedStage field
      { upsert: true, new: true } // Create if not exists, return updated document
    );

    res.status(200).json({
      status: "success",
      message: "Submitted Tender updated successfully!",
      data: systemConfig,
    });
  });

  // Get the tenderSubmittedStage field from the System document
  static getSubmittedTenderStage = catchAsyncError(async (req, res) => {
    const systemConfig = await SystemModel.findOne({});
    if (!systemConfig || !systemConfig.tenderSubmittedStage)
      throw new ClientError("NOT_FOUND", "Please Set System config first");
    res.status(200).json({
      status: "success",
      message: "Submitted tenderId fetched successfully",
      data: systemConfig.tenderSubmittedStage,
    });
  });
}

export default SystemController;
