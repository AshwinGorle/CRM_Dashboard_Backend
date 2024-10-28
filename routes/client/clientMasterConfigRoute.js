import { Router } from "express"
import ClientMasterConfigController from "../../controllers/ClientMaster/clientMasterConfigController.js";
const clientMasterConfigRouter = Router();
//----------------------------Classification-------------------------

clientMasterConfigRouter.get('/classification', ClientMasterConfigController.getAllClassifications);
clientMasterConfigRouter.get('/classification/:classificationId', ClientMasterConfigController.getClassificationById);
clientMasterConfigRouter.post('/classification', ClientMasterConfigController.createClassification);
clientMasterConfigRouter.put('/classification/:classificationId', ClientMasterConfigController.updateClassification);
clientMasterConfigRouter.delete('/classification/:classificationId', ClientMasterConfigController.deleteClassification);

//----------------------------IncorporationType-------------------------

clientMasterConfigRouter.get("/incorporation-type", ClientMasterConfigController.getAllIncorporationTypes);
clientMasterConfigRouter.get("/incorporation-type/:id", ClientMasterConfigController.getIncorporationTypeById);
clientMasterConfigRouter.post("/incorporation-type", ClientMasterConfigController.createIncorporationType);
clientMasterConfigRouter.put("/incorporation-type/:id", ClientMasterConfigController.updateIncorporationType);
clientMasterConfigRouter.delete("/incorporation-type/:id", ClientMasterConfigController.deleteIncorporationType);

//----------------------------RelationshipStatus-------------------------

clientMasterConfigRouter.get("/relationship-status", ClientMasterConfigController.getAllRelationshipStatus);
clientMasterConfigRouter.get("/relationship-status/:id", ClientMasterConfigController.getRelationshipStatusById);
clientMasterConfigRouter.post("/relationship-status", ClientMasterConfigController.createRelationshipStatus);
clientMasterConfigRouter.put("/relationship-status/:id", ClientMasterConfigController.updateRelationshipStatus);
clientMasterConfigRouter.delete("/relationship-status/:id", ClientMasterConfigController.deleteRelationshipStatus);


export default clientMasterConfigRouter;