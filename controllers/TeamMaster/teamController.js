import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js"
import StaffModel from "../../models/StaffModel.js";
import TeamModel from "../../models/TeamModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";

class TeamController{
    static addMember = catchAsyncError(async(req, res, next)=>{
        const teamId = req.params.id;
        const staffId = req.query.staffId;
        console.log("team and staff id " ,  teamId, staffId);
        const staff = await StaffModel.findById(staffId);
        if(!staff) throw new ServerError('NotFound', 'Staff');
          const team = await TeamModel.findById(teamId);
          if(!team) throw new ServerError('NotFound', 'Team');
          staff.teams.push(teamId);
          await staff.save();
          res.status(200).json({
            status: 'success',
            message: `staff ${staff.firstName} ${staff.lastName} added to team ${team.name} successfully`,
          });
    })

    static removeMember = catchAsyncError(async(req, res, next)=>{
        const teamId = req.params.id;
          const staffId = req.query.staffId;
          const staff = await StaffModel.findById(staffId);
          console.log("team and staff id " ,  teamId, staffId);
          if(!staff) throw new ServerError('NotFound', 'Staff');
          const team =  await TeamModel.findById(teamId);
          if(!team) throw new ServerError('NotFound', 'Team');
          staff.teams = staff.teams.filter((id)=>id != teamId);
          await staff.save();
          res.status(200).json({
            status: 'success',
            message: `staff ${staff.firstName} ${staff.lastName} removed from team ${team.name} successfully`,
          });
    })

    static getAllTeam = catchAsyncError(async(req, res, next)=>{
        const team = await TeamModel.find({});
        res.status(201).json({
            status: 'success',
            message: 'All Team fetched successfully',
            data: team,
        });
    })

    static getTeamById = catchAsyncError(async(req, res, next)=>{
        const {id} = req.params;
        const team = await TeamModel.findById(id);
        res.status(201).json({
            status: 'success',
            message: 'All Team successfully',
            data: team,
        });
    })

    static updateTeam = catchAsyncError(async(req, res, next)=>{
        const {id} = req.params;
        const {name} = req.body;
        const team = await TeamModel.findByIdAndUpdate(id, {name}, {new : true});
        res.status(201).json({
            status: 'success',
            message: 'Team updated successfully',
            data: team,
        });
    })
    static createTeam = catchAsyncError(async(req, res, next)=>{
        const {name} = req.body
        const team = await TeamModel.create({name});
        res.status(201).json({
            status: 'success',
            message: 'Team created successfully',
            data: team,
        });
    })
    static deleteTeam = catchAsyncError(async(req, res, next)=>{
        const {id} = req.params
        const team = await TeamModel.findByIdAndDelete(id);
        res.status(201).json({
            status: 'success',
            message: 'Team deleted successfully',
            data: team,
        });
    })
}

export default TeamController;
// import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js"
// import StaffModel from "../../models/StaffModel.js";
// import TeamModel from "../../models/TeamModel.js";
// import { ServerError } from "../../utils/customErrorHandler.utils.js";

// class TeamController{
//     static addMember = catchAsyncError(async(req, res, next)=>{
//         const teamId = req.params.id;
//         const staffId = req.query.staffId;
//         console.log("team and staff id " ,  teamId, staffId);
//         const staff = await StaffModel.findById(staffId);
//         if(!staff) throw new ServerError('NotFound', 'Staff');
//           const team = await TeamModel.findById(teamId);
//           if(!team) throw new ServerError('NotFound', 'Team');
//           staff.teams.push(teamId);
//           await staff.save();
//           res.status(200).json({
//             status: 'success',
//             message: `staff ${staff.firstName} ${staff.lastName} added to team ${team.name} successfully`,
//           });
//     })

//     static removeMember = catchAsyncError(async(req, res, next)=>{
//         const teamId = req.params.id;
//           const staffId = req.query.staffId;
//           const staff = await StaffModel.findById(staffId);
//           console.log("team and staff id " ,  teamId, staffId);
//           if(!staff) throw new ServerError('NotFound', 'Staff');
//           const team =  await TeamModel.findById(teamId);
//           if(!team) throw new ServerError('NotFound', 'Team');
//           staff.teams = staff.teams.filter((id)=>id != teamId);
//           await staff.save();
//           res.status(200).json({
//             status: 'success',
//             message: `staff ${staff.firstName} ${staff.lastName} removed from team ${team.name} successfully`,
//           });
//     })

//     static getAllTeam = catchAsyncError(async(req, res, next)=>{
//         const team = await TeamModel.find({});
//         res.status(201).json({
//             status: 'success',
//             message: 'All Team fetched successfully',
//             data: team,
//         });
//     })

//     static getTeamById = catchAsyncError(async(req, res, next)=>{
//         const {id} = req.params;
//         const team = await TeamModel.findById(id);
//         res.status(201).json({
//             status: 'success',
//             message: 'All Team successfully',
//             data: team,
//         });
//     })

//     static updateTeam = catchAsyncError(async(req, res, next)=>{
//         const {id} = req.params;
//         const {name} = req.body;
//         const team = await TeamModel.findByIdAndUpdate(id, {name}, {new : true});
//         res.status(201).json({
//             status: 'success',
//             message: 'Team updated successfully',
//             data: team,
//         });
//     })
//     static createTeam = catchAsyncError(async(req, res, next)=>{
//         const {name} = req.body
//         const team = await TeamModel.create({name});
//         res.status(201).json({
//             status: 'success',
//             message: 'Team created successfully',
//             data: team,
//         });
//     })
//     static deleteTeam = catchAsyncError(async(req, res, next)=>{
//         const {id} = req.params
//         const team = await TeamModel.findByIdAndDelete(id);
//         res.status(201).json({
//             status: 'success',
//             message: 'Team deleted successfully',
//             data: team,
//         });
//     })
// }

// export default TeamController;