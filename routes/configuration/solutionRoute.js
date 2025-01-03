import { Router } from "express";
import SolutionController from "../../controllers/Configuration/solutionController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const solutionRouter = Router();

const entity = "CONFIGURATION";

solutionRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  SolutionController.getAllSolution
);

solutionRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  SolutionController.getSolutionById
);
solutionRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  SolutionController.createSolution
);
solutionRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  SolutionController.updateSolution
);
solutionRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  SolutionController.deleteSolution
);

export default solutionRouter;
