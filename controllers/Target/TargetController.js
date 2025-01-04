import mongoose from "mongoose";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { getTargetsForYear, setTarget, validateTargetsFormate } from "../../service/targetService.js";
import { ClientError } from "../../utils/customErrorHandler.utils.js";

class TargetController{
      static setTargetController = catchAsyncError(async(req, res, next, session)=>{
         const {entityType, entityId, year, targets} = req.body;
         if(!entityType || !entityId || !year || !targets) throw new ClientError("NOT_FOUND",`All fields are required`);
         if(!validateTargetsFormate(targets)) throw new ClientError("INVALID_INPUT",`Please provide targets in valid formate`);
 
         const EntityModel = mongoose.model(entityType);
         // if model does not exists 
         if (!EntityModel) throw new ClientError("NOT_FOUND",`Invalid entityType: ${entityType}`);
 
         const entityExists = await EntityModel.findById(entityId);
         if (!entityExists) throw new ClientError("NOT_FOUND", `${entityType} with ID ${entityId} does not exist.`);

         const target =  await setTarget(entityType, entityId, year, targets, session)
         return res.status(201).json({
            status: "success",
            message: `Target added successfully for ${entityType} : ${entityExists.label}!`,
            data: target,
        });
      },true) 
      
      static getTargetController = catchAsyncError(async(req, res, next, session)=>{
         const {entityType, year} = req.body;
         if(!entityType || !year ) throw new ClientError("NOT_FOUND",`All fields are required`);
 
         const EntityModel = mongoose.model(entityType); 
         if (!EntityModel) throw new ClientError("NOT_FOUND",`Invalid entityType: ${entityType}`);
         
         const targetDetails = await getTargetsForYear(entityType, year);
         
         return res.status(201).json({
            status: "success",
            message: `Targets fetched successfully for ${entityType}!`,
            data: targetDetails,
        });
      },true) 


}  


export default TargetController