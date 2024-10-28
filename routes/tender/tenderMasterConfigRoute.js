import { Router } from "express";
import TenderMasterConfigController from "../../controllers/TenderMaster/tenderMasterConfigController.js";
const tenderMasterConfigRouter = Router();

tenderMasterConfigRouter.get("/stage",TenderMasterConfigController.getAllStages);
tenderMasterConfigRouter.get("/stage/:id",TenderMasterConfigController.getStageById);
tenderMasterConfigRouter.post("/stage",TenderMasterConfigController.createStage);
tenderMasterConfigRouter.put("/stage/:id",TenderMasterConfigController.updateStage);
tenderMasterConfigRouter.delete("/stage/:id",TenderMasterConfigController.deleteStage);

export default tenderMasterConfigRouter;