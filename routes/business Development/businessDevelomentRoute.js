import { Router } from "express";
import BusinessDevelopmentController from "../../controllers/Business Development/businessDevelopmentController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
const businessDevelopmentRouter = Router();

const entity = "BUSINESS DEVELOPMENT";
businessDevelopmentRouter.get(
  "/",
  checkPermissions(entity, "GET ALL"),
  BusinessDevelopmentController.getAllBusinessDevelopments
);
businessDevelopmentRouter.get(
  "/:id",
  checkPermissions(entity, "READ"),
  BusinessDevelopmentController.getBusinessDevelopmentById
);
businessDevelopmentRouter.post(
  "/",
  checkPermissions(entity, "CREATE"),
  BusinessDevelopmentController.createBusinessDevelopment
);
businessDevelopmentRouter.put(
  "/:id",
  checkPermissions(entity, "UPDATE"),
  BusinessDevelopmentController.updateBusinessDevelopment
);
businessDevelopmentRouter.delete(
  "/:id",
  checkPermissions(entity, "DELETE"),
  BusinessDevelopmentController.deleteBusinessDevelopment
);

export default businessDevelopmentRouter;
