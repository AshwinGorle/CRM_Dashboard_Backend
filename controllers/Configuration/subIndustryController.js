import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SubIndustryModel from "../../models/Configuration/SubIndustryModel.js";

class SubIndustryController {
    // Create SubIndustryMaster
    static createSubIndustry = catchAsyncError(async (req, res, next) => {
        const { label, description } = req.body;
        const newSubIndustryMaster = await SubIndustryModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Sub-Industry Master created successfully',
            data: newSubIndustryMaster,
        });
    });

    // Get all SubIndustryMasters
    static getAllSubIndustry = catchAsyncError(async (req, res, next) => {
        const subIndustryMasters = await SubIndustryModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Sub-Industry Masters retrieved successfully',
            data: subIndustryMasters,
        });
    });

    // Get SubIndustryMaster by ID
    static getSubIndustryById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const subIndustryMaster = await SubIndustryModel.findById(id);
        if (!subIndustryMaster) throw new ServerError("NotFound", "Sub-Industry Master");
        res.status(200).json({
            status: 'success',
            message: 'Sub-Industry Master retrieved successfully',
            data: subIndustryMaster,
        });
    });

    // Update SubIndustryMaster
    static updateSubIndustry = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label, description } = req.body;
        const subIndustryMaster = await SubIndustryModel.findById(id);
    
        if (!subIndustryMaster) throw new ServerError("NotFound", "Sub-Industry Master");
    
        subIndustryMaster.label = label;
        subIndustryMaster.description = description;
        const updatedSubIndustryMaster = await subIndustryMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Sub-Industry Master updated successfully',
            data: updatedSubIndustryMaster,
        });
    });

    // Delete SubIndustryMaster
    static deleteSubIndustry = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const subIndustryMaster = await SubIndustryModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Sub-Industry Master deleted successfully',
            data: subIndustryMaster,
        });
    });
}

export default SubIndustryController;
