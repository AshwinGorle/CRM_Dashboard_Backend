import { Router } from "express";
import tenderMasterConfigRouter from "./tenderMasterConfigRoute.js";
const tenderMasterRouter = Router();
import TenderMasterController from "../../controllers/TenderMaster/tenderMasterController.js";

tenderMasterRouter.use("/config", tenderMasterConfigRouter);
tenderMasterRouter.get('/:id', TenderMasterController.getTenderMasterById);
tenderMasterRouter.get('/', TenderMasterController.getAllTenderMasters);
tenderMasterRouter.post('/', TenderMasterController.createTenderMaster);
tenderMasterRouter.put('/:id', TenderMasterController.updateTenderMaster);
tenderMasterRouter.delete('/:id', TenderMasterController.deleteTenderMaster);

export default tenderMasterRouter;