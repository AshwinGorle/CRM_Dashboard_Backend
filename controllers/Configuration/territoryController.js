import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import TerritoryModel from "../../models/Configuration/TerritoryModel.js";
class TerritoryController {
    
    // Create Territory
    static createTerritory = catchAsyncError(async (req, res, next) => {
        const { label, description } = req.body;
        const newTerritory = await TerritoryModel.create({ label, description });
        res.status(201).json({
            status: 'success',
            message: 'Territory  created successfully',
            data: newTerritory,
        });
    });

    // Get all territories
    static getAllTerritory = catchAsyncError(async (req, res, next) => {
        const territories = await TerritoryModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Territory s retrieved successfully',
            data: territories,
        });
    });

    // Get Territory by ID
    static getTerritoryById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const territory = await TerritoryModel.findById(id);
        if (!territory) throw new ServerError("NotFound", "Territory ");
        res.status(200).json({
            status: 'success',
            message: 'Territory  retrieved successfully',
            data: territory,
        });
    });

    // Update Territory
    static updateTerritory = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label, description } = req.body;
        const territory = await TerritoryModel.findById(id);
    
        if (!territory) throw new ServerError("NotFound", "Territory ");
    
        territory.label = label;
        territory.description = description;
        const updatedTerritory = await territory.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Territory  updated successfully',
            data: updatedTerritory,
        });
    });

    // Delete Territory
    static deleteTerritory = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const territory = await TerritoryModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Territory  deleted successfully',
            data: territory
        });
    });
}

export default TerritoryController;
