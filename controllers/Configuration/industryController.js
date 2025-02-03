import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import IndustryMasterModel from "../../models/Configuration/IndustryModel.js";

class IndustryController {
    // Create IndustryMaster
    static createIndustry = catchAsyncError(async (req, res, next) => {
        console.log("create industry called !")
        const { label , description } = req.body;
        const newIndustryMaster = await IndustryMasterModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Industry Master created successfully',
            data: newIndustryMaster,
        });
    });

    // Get all IndustryMasters
    static getAllIndustry = catchAsyncError(async (req, res, next) => {
        const industryMasters = await IndustryMasterModel.find({
            $or: [{ isDeleted: null }, { isDeleted: false }],
          });
        res.status(200).json({
            status: 'success',
            message: 'All Industry Masters retrieved successfully',
            data: industryMasters,
        });
    });

    // Get IndustryMaster by ID
    static getIndustryById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const industryMaster = await IndustryMasterModel.findById(id);
        if (!industryMaster) throw new ServerError("NotFound", "Industry Master");
        res.status(200).json({
            status: 'success',
            message: 'Industry Master retrieved successfully',
            data: industryMaster,
        });
    });

    // Update IndustryMaster
    static updateIndustry = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label, description } = req.body;
        const industryMaster = await IndustryMasterModel.findById(id);
    
        if (!industryMaster) throw new ServerError("NotFound", "Industry Master");
    
        industryMaster.label = label;
        industryMaster.description = description;
        const updatedIndustryMaster = await industryMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Industry Master updated successfully',
            data: updatedIndustryMaster,
        });
    });

    // Delete IndustryMaster
    static deleteIndustry = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        let { undo } = req.query;
        undo = undo == "true";
        const deleteStatus = !undo; 


        const industryMaster = await IndustryMasterModel.findByIdAndUpdate(id ,{isDeleted : deleteStatus }, { new : true});
    
        res.status(200).json({
            status: 'success',
            message: 'Industry Master deleted successfully',
            data: {industry : industryMaster}
        });
    });
}

export default IndustryController;
