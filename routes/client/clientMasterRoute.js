import { Router } from "express";
import ClientMasterController from "../../controllers/ClientMaster/clientMasterController.js";
import clientMasterConfigRouter from "./clientMasterConfigRoute.js";
import uploadStream from "../../utils/memoryStorage.utils.js";
import upload from "../../utils/storage.utils.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";

const entity = "CLIENT";
const clientMasterRouter = Router();
clientMasterRouter.use("/config", clientMasterConfigRouter);

clientMasterRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  ClientMasterController.getAllClient
);

clientMasterRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  ClientMasterController.getClientById
);

clientMasterRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  uploadStream.single("avatar"),
  ClientMasterController.createClient
);

clientMasterRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  uploadStream.single("avatar"),
  ClientMasterController.updateClient
);

clientMasterRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  ClientMasterController.deleteClient
);

export default clientMasterRouter;
