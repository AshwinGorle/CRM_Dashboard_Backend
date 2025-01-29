import { Router } from "express";
import TargetController from "../../controllers/Target/TargetController.js";
import { actionTypes } from "../../config/actionTypes.js";
import checkPermissions from "../../middlewares/checkPermission.js";

const targetRouter = Router();

const entity = "TARGET";

targetRouter.post(
  "/",
  checkPermissions(entity, actionTypes.ALLOW),
  TargetController.getTargetController
); // used to get target
targetRouter.post(
  "/set",
  checkPermissions(entity, actionTypes.ALLOW),
  TargetController.setTargetController
); // used for both update and create

export default targetRouter;
