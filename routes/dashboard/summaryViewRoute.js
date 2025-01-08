import { Router } from "express";
import SummaryViewController from "../../controllers/Dashboards/SummaryViewController.js";
const summaryViewRouter = Router();
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";

const entity = "SUMMARY VIEW";
summaryViewRouter.post(
  "/",
  checkPermissions(entity, actionTypes.ALL_VIEW),
  SummaryViewController.getIntireSummaryView
);
// summaryViewRouter.post(
//   "/heat-map",
//   checkPermissions(entity, actionTypes.ALL_VIEW),
//   SummaryViewController.getHeatMap
// );

export default summaryViewRouter;

