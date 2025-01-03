import { Router } from "express";
import PipeViewController from "../../controllers/Dashboards/PipeViewController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const pipeViewRouter = Router();

const entity = "PIPE VIEW";
const { ALL_VIEW, MY_VIEW } = actionTypes;
pipeViewRouter.post(
  "/",
  (req, res, next) => {
    const viewType = req.query.myView === "true" ? MY_VIEW : ALL_VIEW;
    checkPermissions(entity, viewType)(req, res, next);
  },
  PipeViewController.getPipeView
);

export default pipeViewRouter;
