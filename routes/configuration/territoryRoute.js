import { Router } from "express";
import TerritoryController from "../../controllers/Configuration/territoryController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const territoryRouter = Router();

const entity = "CONFIGURATION";
territoryRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  TerritoryController.getAllTerritory
);
territoryRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  TerritoryController.getTerritoryById
);
territoryRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  TerritoryController.createTerritory
);
territoryRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  TerritoryController.updateTerritory
);
territoryRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  TerritoryController.deleteTerritory
);

export default territoryRouter;
