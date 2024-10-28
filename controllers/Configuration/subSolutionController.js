import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SubSolutionModel from "../../models/Configuration/SubSolutionModel.js";

class SubSolutionController {
    // Create SolutionMaster
    static createSubSolution = catchAsyncError(async (req, res, next) => {
        const { label, description } = req.body;
        const newSubSolutionMaster = await SubSolutionModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Solution Master created successfully',
            data: newSubSolutionMaster,
        });
    });

    // Get all SolutionMasters
    static getAllSubSolution = catchAsyncError(async (req, res, next) => {
        const subSolutionMasters = await SubSolutionModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Solution Masters retrieved successfully',
            data: subSolutionMasters,
        });
    });

    // Get SolutionMaster by ID
    static getSubSolutionById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const solutionMaster = await SubSolutionModel.findById(id);
        if (!solutionMaster) throw new ServerError("NotFound", "Solution Master");
        res.status(200).json({
            status: 'success',
            message: 'Solution Master retrieved successfully',
            data: solutionMaster,
        });
    });

    // Update SolutionMaster
    static updateSubSolution = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label, description } = req.body;
        const solutionMaster = await SubSolutionModel.findById(id);
    
        if (!solutionMaster) throw new ServerError("NotFound", "Solution Master");
    
        solutionMaster.label = label;
        solutionMaster.description = description;
        const updatedSolutionMaster = await solutionMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Solution Master updated successfully',
            data: updatedSolutionMaster,
        });
    });

    // Delete SolutionMaster
    static deleteSubSolution = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const solutionMaster = await SubSolutionModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: ' Sub Solution Master deleted successfully',
            data: solutionMaster,
        });
    });
}

export default SubSolutionController;
