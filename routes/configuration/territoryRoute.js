import { Router } from "express";
import TerritoryController from "../../controllers/Configuration/territoryController.js";
const territoryRouter = Router();

territoryRouter.get('/', TerritoryController.getAllTerritory);
territoryRouter.get('/:id', TerritoryController.getTerritoryById);
territoryRouter.post('/', TerritoryController.createTerritory);
territoryRouter.put('/:id', TerritoryController.updateTerritory);
territoryRouter.delete('/:id', TerritoryController.deleteTerritory);

export default territoryRouter;
