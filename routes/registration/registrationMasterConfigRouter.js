import { Router } from "express";
import RegistrationMasterConfigController from "../../controllers/RegistrationMaster/registrationMasterConfigController.js";

const registrationMasterConfigRouter = Router();

//-----------------------------Registration status -----------------------------
registrationMasterConfigRouter.get('/registration-status' , RegistrationMasterConfigController.getAllRegistrationStatus);
registrationMasterConfigRouter.get('/registration-status/:id' , RegistrationMasterConfigController.getRegistrationStatusById);
registrationMasterConfigRouter.post('/registration-status' , RegistrationMasterConfigController.createRegistrationStatus);
registrationMasterConfigRouter.put('/registration-status/:id' , RegistrationMasterConfigController.updateRegistrationStatus);
registrationMasterConfigRouter.delete('/registration-status/:id' , RegistrationMasterConfigController.deleteRegistrationStatus);

export default registrationMasterConfigRouter;