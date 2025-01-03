import { Router } from "express";
import IndustryController from "../../controllers/Configuration/industryController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const industryRouter = Router();

const entity = "CONFIGURATION";

industryRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  IndustryController.getAllIndustry
);
industryRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  IndustryController.getIndustryById
);
industryRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  IndustryController.createIndustry
);
industryRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  IndustryController.updateIndustry
);
industryRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  IndustryController.deleteIndustry
);

export default industryRouter;
