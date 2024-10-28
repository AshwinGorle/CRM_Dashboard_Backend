
import { Router } from "express";
import registrationMasterConfigRouter from "../registration/registrationMasterConfigRouter.js"
import RegistrationMasterController from "../../controllers/RegistrationMaster/RegistrationMasterController.js";

const registrationMasterRouter = Router();

registrationMasterRouter.use('/config', registrationMasterConfigRouter);
registrationMasterRouter.get('/', RegistrationMasterController.getAllRegistrationMasters);
registrationMasterRouter.get('/:id', RegistrationMasterController.getRegistrationMasterById);
registrationMasterRouter.post('/', RegistrationMasterController.createRegistrationMaster);
registrationMasterRouter.put('/:id', RegistrationMasterController.updateRegistrationMaster);
registrationMasterRouter.delete('/:id', RegistrationMasterController.deleteRegistrationMaster);

export default registrationMasterRouter;
