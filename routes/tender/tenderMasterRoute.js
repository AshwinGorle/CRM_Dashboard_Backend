import { Router } from "express";
import tenderMasterConfigRouter from "./tenderMasterConfigRoute.js";
const tenderMasterRouter = Router();
import TenderMasterController from "../../controllers/TenderMaster/tenderMasterController.js";
import { actionTypes } from "../../config/actionTypes.js";
import checkPermissions from "../../middlewares/checkPermission.js";

const entity = "TENDER";
tenderMasterRouter.use("/config", tenderMasterConfigRouter);
tenderMasterRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  TenderMasterController.getTenderMasterById
);
tenderMasterRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  TenderMasterController.getAllTenderMasters
);
tenderMasterRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  TenderMasterController.createTenderMaster
);
tenderMasterRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  TenderMasterController.updateTenderMaster
);
tenderMasterRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  TenderMasterController.deleteTenderMaster
);

export default tenderMasterRouter;
