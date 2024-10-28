import { Router } from "express";
// import SalesStageController from "../../controllers/Configuration/salesStageMasterController.js";
import SalesStageController from "../../controllers/Stage/salesStageController.js";
const salesStageRouter = Router();

salesStageRouter.get('/', SalesStageController.getAllSalesStage);
salesStageRouter.get('/:id', SalesStageController.getSalesStageById);
salesStageRouter.post('/', SalesStageController.createSalesStage);
salesStageRouter.put('/:id', SalesStageController.updateSalesStage);
salesStageRouter.delete('/:id', SalesStageController.deleteSalesStage);

export default salesStageRouter;
