import { Router } from "express";
import registrationMasterConfigRouter from "../registration/registrationMasterConfigRouter.js";
import RegistrationMasterController from "../../controllers/RegistrationMaster/RegistrationMasterController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";

const registrationMasterRouter = Router();

const entity = "REGISTRATION";
registrationMasterRouter.use("/config", registrationMasterConfigRouter);
registrationMasterRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  RegistrationMasterController.getAllRegistrationMasters
);
registrationMasterRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  RegistrationMasterController.getRegistrationMasterById
);
registrationMasterRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  RegistrationMasterController.createRegistrationMaster
);
registrationMasterRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  RegistrationMasterController.updateRegistrationMaster
);
registrationMasterRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  RegistrationMasterController.deleteRegistrationMaster
);

export default registrationMasterRouter;
