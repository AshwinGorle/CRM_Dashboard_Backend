import { Router } from "express";
import SalesSubStageController from "../../controllers/Stage/salesSubStageController.js";
import { actionTypes } from "../../config/actionTypes.js";
import checkPermissions from "../../middlewares/checkPermission.js";
const salesSubStageRouter = Router();

const entity = "CONFIGURATION";

salesSubStageRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  SalesSubStageController.getAllSalesSubStage
);

salesSubStageRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  SalesSubStageController.getSalesSubStageById
);

salesSubStageRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  SalesSubStageController.createSalesSubStage
);

salesSubStageRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  SalesSubStageController.updateSalesSubStage
);

salesSubStageRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  SalesSubStageController.deleteSalesSubStage
);

export default salesSubStageRouter;
