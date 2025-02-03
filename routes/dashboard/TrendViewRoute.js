import { Router } from "express";
import TrendViewController from "../../controllers/Dashboards/TrendViewController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const trendViewRouter = Router();

const entity = "TREND VIEW";
trendViewRouter.post(
  "/",
  checkPermissions(entity, actionTypes.ALL_VIEW),
  TrendViewController.getTrendView
);

export default trendViewRouter;
