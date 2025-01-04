import { Router } from "express";
// import SalesStageController from "../../controllers/Configuration/salesStageMasterController.js";
import SalesStageController from "../../controllers/Stage/salesStageController.js";
const salesStageRouter = Router();
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";

const entity = "CONFIGURATION";

salesStageRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  SalesStageController.getAllSalesStage
);

salesStageRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  SalesStageController.getSalesStageById
);

salesStageRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  SalesStageController.createSalesStage
);

salesStageRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  SalesStageController.updateSalesStage
);

salesStageRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  SalesStageController.deleteSalesStage
);

export default salesStageRouter;
