import { Router } from "express";
import SalesSubStageController from '../../controllers/Stage/salesSubStageController.js'
const salesSubStageRouter = Router();

 salesSubStageRouter.get('/', SalesSubStageController.getAllSalesSubStage);
 salesSubStageRouter.get('/:id', SalesSubStageController.getSalesSubStageById);
 salesSubStageRouter.post('/', SalesSubStageController.createSalesSubStage);
 salesSubStageRouter.put('/:id', SalesSubStageController.updateSalesSubStage);
 salesSubStageRouter.delete('/:id', SalesSubStageController.deleteSalesSubStage);

export default salesSubStageRouter;
