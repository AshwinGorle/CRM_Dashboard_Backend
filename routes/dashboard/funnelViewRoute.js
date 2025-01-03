import { Router } from "express";
import FunnelViewController from "../../controllers/Dashboards/FunnelViewController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const funnelViewRouter = Router();

const entity = "FUNNEL VIEW";
const { ALL_VIEW, MY_VIEW } = actionTypes;

funnelViewRouter.post(
  "/",
  (req, res, next) => {
    const viewType = req.query.myView === "true" ? MY_VIEW : ALL_VIEW;
    checkPermissions(entity, viewType)(req, res, next);
  },
  FunnelViewController.getFunnelView
);

export default funnelViewRouter;
