import { Router } from "express";
import SubIndustryController from "../../controllers/Configuration/subIndustryController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const subIndustryRouter = Router();

const entity = "CONFIGURATION";

subIndustryRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  SubIndustryController.getAllSubIndustry
);
subIndustryRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  SubIndustryController.getSubIndustryById
);
subIndustryRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  SubIndustryController.createSubIndustry
);
subIndustryRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  SubIndustryController.updateSubIndustry
);
subIndustryRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  SubIndustryController.deleteSubIndustry
);

export default subIndustryRouter;
