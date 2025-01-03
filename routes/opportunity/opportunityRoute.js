import { Router } from "express";
import OpportunityController from "../../controllers/Opportunity/opportunityController.js";
import revenueMasterRouter from "./revenueRoute.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const opportunityRouter = Router();

const entity = "OPPORTUNITY";
opportunityRouter.use("/revenue", revenueMasterRouter);
opportunityRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  OpportunityController.getAllOpportunities
);
opportunityRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  OpportunityController.getOpportunityById
);
opportunityRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  OpportunityController.createOpportunity
);
opportunityRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  OpportunityController.updateOpportunity
);
opportunityRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  OpportunityController.deleteOpportunity
);

export default opportunityRouter;
