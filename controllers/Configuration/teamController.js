import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import TeamMasterModel from "../../models/TeamMaster.js";

class TeamMasterController {
    // Create TeamMaster
    static createTeamMaster = catchAsyncError(async (req, res, next) => {
        const teamData = req.body;
        const newTeamMaster = await TeamMasterModel.create(teamData);
        res.status(201).json({
            status: 'success',
            message: 'Team Member created successfully',
            data: newTeamMaster,
        });
    });

    // Get all TeamMastersx 
    static getAllTeamMasters = catchAsyncError(async (req, res, next) => {
        const teamMasters = await TeamMasterModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Team Members retrieved successfully',
            data: teamMasters,
        });
    });

    // Get TeamMaster by ID
    static getTeamMasterById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const teamMaster = await TeamMasterModel.findById(id);
        if (!teamMaster) throw new ServerError("NotFound", "Team Member");
        res.status(200).json({
            status: 'success',
            message: 'Team Member retrieved successfully',
            data: teamMaster,
        });
    });

    // Update TeamMaster
    static updateTeamMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
        const teamMaster = await TeamMasterModel.findById(id);
    
        if (!teamMaster) throw new ServerError("NotFound", "Team Member");
    
        Object.keys(updateData).forEach((key) => {
            teamMaster[key] = updateData[key];
        });
        const updatedTeamMaster = await teamMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Team Member updated successfully',
            data: updatedTeamMaster,
        });
    });

    // Delete TeamMaster
    static deleteTeamMaster = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const teamMaster = await TeamMasterModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Team Member deleted successfully',
            data: teamMaster
        });
    });
}

export default TeamMasterController;
