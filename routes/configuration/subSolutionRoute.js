import { Router } from "express";
import SubSolutionController from "../../controllers/Configuration/subSolutionController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const subSolutionRouter = Router();

const entity = "CONFIGURATION";
subSolutionRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  SubSolutionController.getAllSubSolution
);
subSolutionRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  SubSolutionController.getSubSolutionById
);
subSolutionRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  SubSolutionController.createSubSolution
);
subSolutionRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  SubSolutionController.updateSubSolution
);
subSolutionRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  SubSolutionController.deleteSubSolution
);

export default subSolutionRouter;
