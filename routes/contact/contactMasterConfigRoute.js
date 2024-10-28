import ContactMasterConfigController from "../../controllers/ContactMaster/contactMasterConfigController.js";
import { Router } from "express";
const contactMasterConfigRouter = Router();
import upload from "../../utils/storage.utils.js";

//--------------------------------ArcheType---------------------------

contactMasterConfigRouter.get('/archetype', ContactMasterConfigController.getAllArchetypes);
contactMasterConfigRouter.get('/archetype/:id', ContactMasterConfigController.getArchetypeById);
contactMasterConfigRouter.post('/archetype', ContactMasterConfigController.createArchetype);
contactMasterConfigRouter.put('/archetype/:id', ContactMasterConfigController.updateArchetype);
contactMasterConfigRouter.delete('/archetype/:id', ContactMasterConfigController.deleteArchetype);

//--------------------------------RelationShipDegree---------------------------

contactMasterConfigRouter.get('/relationship-degree', ContactMasterConfigController.getAllRelationshipDegrees);
contactMasterConfigRouter.get('/relationship-degree/:id', ContactMasterConfigController.getRelationshipDegreeById);
contactMasterConfigRouter.post('/relationship-degree',ContactMasterConfigController.createRelationshipDegree);
contactMasterConfigRouter.put('/relationship-degree/:id',    ContactMasterConfigController.updateRelationshipDegree);
contactMasterConfigRouter.delete('/relationship-degree/:id', ContactMasterConfigController.deleteRelationshipDegree);

export default contactMasterConfigRouter;