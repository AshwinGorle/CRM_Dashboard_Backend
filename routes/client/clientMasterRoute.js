import { Router } from "express";
import ClientMasterController from "../../controllers/ClientMaster/clientMasterController.js";
import clientMasterConfigRouter from "./clientMasterConfigRoute.js";
import uploadStream from "../../utils/memoryStorage.utils.js";
import upload from "../../utils/storage.utils.js";

const clientMasterRouter = Router();
clientMasterRouter.use('/config',clientMasterConfigRouter);
clientMasterRouter.get('/', ClientMasterController.getAllClient);
clientMasterRouter.get('/:id', ClientMasterController.getClientById);
clientMasterRouter.post('/', uploadStream.single('avatar') ,ClientMasterController.createClient);
clientMasterRouter.put('/:id', uploadStream.single('avatar') ,ClientMasterController.updateClient);
clientMasterRouter.delete('/:id', ClientMasterController.deleteClient);

export default clientMasterRouter;