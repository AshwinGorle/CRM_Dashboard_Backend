import { Router } from "express";
import ContactMasterController from "../../controllers/ContactMaster/contactMasterController.js";
import contactMasterConfigRouter from "./contactMasterConfigRoute.js";
import validateContact from "../../middlewares/validateContact.js";
import upload from "../../utils/storage.utils.js";
import uploadStream from "../../utils/memoryStorage.utils.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const contactMasterRouter = Router();

const entity = "CONTACT";

contactMasterRouter.use("/config", contactMasterConfigRouter);
contactMasterRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  ContactMasterController.getAllContacts
);
contactMasterRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  ContactMasterController.getContactById
);
contactMasterRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  uploadStream.single("avatar"),
  ContactMasterController.createContact
);
contactMasterRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  uploadStream.single("avatar"),
  ContactMasterController.updateContact
);
contactMasterRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  ContactMasterController.deleteContact
);

export default contactMasterRouter;
