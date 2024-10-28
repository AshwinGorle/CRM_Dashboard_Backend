import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import RegistrationStatusModel from "../../models/ConfigModels/Registration/StatusModel.js";

class RegistrationMasterConfigController{
     //----------------------------Registration status-----------------
     static createRegistrationStatus = catchAsyncError(async (req, res, next) => {
        const { label } = req.body;
        const newRegistrationStatus = await RegistrationStatusModel.create({ label });
        res.status(201).json({
          status: 'success',
          message: 'Registration Status created successfully',
          data: newRegistrationStatus,
        });
      });

      static getAllRegistrationStatus = catchAsyncError(async (req, res, next) => {
        const registrationStatuses = await RegistrationStatusModel.find();
        res.status(200).json({
          status: 'success',
          message: 'All Registration Statuses retrieved successfully',
          data: registrationStatuses,
        });
      });

      static getRegistrationStatusById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const registrationStatus = await RegistrationStatusModel.findById(id);
        if (!registrationStatus) throw new ServerError("NotFound", "Registration Status");
        res.status(200).json({
          status: 'success',
          message: 'Registration Status retrieved successfully',
          data: registrationStatus,
        });
      });

      static updateRegistrationStatus = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label } = req.body;
        const registrationStatus = await RegistrationStatusModel.findById(id);
    
        if (!registrationStatus) throw new ServerError("NotFound", "Registration Status");
    
        registrationStatus.label = label;
        const updatedRegistrationStatus = await registrationStatus.save();
    
        res.status(200).json({
          status: 'success',
          message: 'Registration Status updated successfully',
          data: updatedRegistrationStatus,
        });
      });

      static deleteRegistrationStatus = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const registrationStatus = await RegistrationStatusModel.findByIdAndDelete(id);
    
        res.status(200).json({
          status: 'success',
          message: 'Registration Status deleted successfully',
          data : registrationStatus
        });
      });
      
}

export default RegistrationMasterConfigController;