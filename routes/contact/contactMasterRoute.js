import { Router } from "express";
import ContactMasterController from "../../controllers/ContactMaster/contactMasterController.js";
import contactMasterConfigRouter from "./contactMasterConfigRoute.js";
import validateContact from "../../middlewares/validateContact.js";
import upload from "../../utils/storage.utils.js";
import uploadStream from "../../utils/memoryStorage.utils.js";
const contactMasterRouter = Router();

contactMasterRouter.use('/config', contactMasterConfigRouter);
contactMasterRouter.get('/', ContactMasterController.getAllContacts);
contactMasterRouter.get('/:id', ContactMasterController.getContactById);
contactMasterRouter.post('/', uploadStream.single('avatar'), ContactMasterController.createContact);
contactMasterRouter.put('/:id', uploadStream.single('avatar'), ContactMasterController.updateContact);
contactMasterRouter.delete('/:id', ContactMasterController.deleteContact);

export default contactMasterRouter;