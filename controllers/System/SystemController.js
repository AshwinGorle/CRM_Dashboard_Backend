import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import TenderStageModel from "../../models/ConfigModels/TenderMaster/TenderStageModel.js";
import { ClientError } from "../../utils/customErrorHandler.utils.js";
import SystemModel from "../../models/SystemModel.js";
import SalesSubStageModel from "../../models/StageModels/SalesSubStage.js";

class SystemController {
    // Update the wonSalesStage field in the System document
    static updateWonStage = catchAsyncError(async (req, res) => {

        // Validations 
        const { wonSalesStage  } = req.body;
        console.log("stage id in won update : " , wonSalesStage)
        if (!wonSalesStage) throw new ClientError('requiredField', 'Sales sub stage id is required!')
        const salesStage = await SalesSubStageModel.findById(wonSalesStage);
        console.log("salesStage", salesStage);
        if(!salesStage) throw new ClientError('NOT_FOUND', "Please Provide valid sales sub stage to set as won stage");

        // Find and update the single System document
        const systemConfig = await SystemModel.findOneAndUpdate(
            {}, // No filter to ensure only one document
            { $set: { wonSalesStage } }, // Update wonSalesStage field
            { upsert: true, new: true } // Create if not exists, return updated document
        );

        return res.status(200).json({ status : "success", message : "System config updated successfully!", data: systemConfig });
    });

    // Get the wonSalesStage field from the System document
    static getWonStage = catchAsyncError(async (req, res) => {
        const systemConfig = await SystemModel.findOne({});
        if (!systemConfig || !systemConfig.wonSalesStage) throw new ClientError('NOT_FOUND' , "Please Set System config first")
        res.status(200).json({status : "success", message : "Won Stage fetched successfully!", data: systemConfig.wonSalesStage});
    });

    // Update the submittedTenderStage field in the System document
    static updateSubmittedTenderStage = catchAsyncError(async (req, res) => {
        const { submittedTenderStage } = req.body;

        if (!submittedTenderStage) throw new ClientError("requiredField", "Tender id is required");
        const tender = await TenderStageModel.findById(submittedTenderStage);
        if(!tender) throw new ClientError("NOT_FOUND", "")
        // Find and update the single System document
        const systemConfig = await SystemModel.findOneAndUpdate(
            {}, // No filter to ensure only one document
            { $set: { submittedTenderStage } }, // Update submittedTenderStage field
            { upsert: true, new: true } // Create if not exists, return updated document
        );

        res.status(200).json({ status: "success", message: "Submitted Tender updated successfully!", data: systemConfig });
    });

    // Get the submittedTenderStage field from the System document
    static getSubmittedTenderStage = catchAsyncError(async (req, res) => {
        const systemConfig = await SystemModel.findOne({});
        if (!systemConfig || !systemConfig.submittedTenderStage) throw new ClientError('NOT_FOUND' , "Please Set System config first")
        res.status(200).json({ status : "success", message : "Submitted tenderId fetched successfully", data: systemConfig.submittedTenderStage });
    });

}

export default SystemController;
