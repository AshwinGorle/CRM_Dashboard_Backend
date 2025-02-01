import { Router } from "express";
import LeadController from "../../controllers/Lead/LeadController.js";
import { actionTypes } from "../../config/actionTypes.js";
import checkPermissions from "../../middlewares/checkPermission.js";

const leadRouter = Router();
const entity = "LEAD";

leadRouter.get(
  "/:id",
  // checkPermissions(entity, actionTypes.READ),
  LeadController.getLead
);

leadRouter.get(
  "/",
  // checkPermissions(entity, actionTypes.GET_ALL),
  LeadController.getAllLeads
);

leadRouter.post(
  "/",
  // checkPermissions(entity, actionTypes.CREATE),
  LeadController.createLead
);

leadRouter.put(
  "/:id",
  // checkPermissions(entity, actionTypes.UPDATE),
  LeadController.updateLead
);

leadRouter.delete(
  "/:id",
  // checkPermissions(entity, actionTypes.DELETE),
  LeadController.deleteLead
);

export default leadRouter;
