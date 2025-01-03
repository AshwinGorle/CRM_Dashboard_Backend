import { Router } from "express";
import BusinessDevelopmentController from "../../controllers/Business Development/businessDevelopmentController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const businessDevelopmentRouter = Router();

const entity = "BUSINESS DEVELOPMENT";

businessDevelopmentRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  BusinessDevelopmentController.getAllBusinessDevelopments
);

businessDevelopmentRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  BusinessDevelopmentController.getBusinessDevelopmentById
);

businessDevelopmentRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  BusinessDevelopmentController.createBusinessDevelopment
);

businessDevelopmentRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  BusinessDevelopmentController.updateBusinessDevelopment
);

businessDevelopmentRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  BusinessDevelopmentController.deleteBusinessDevelopment
);

export default businessDevelopmentRouter;
