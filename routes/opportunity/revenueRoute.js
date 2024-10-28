import { Router } from "express";
import RevenueMasterController from "../../controllers/Opportunity/revenueController.js";

const revenueMasterRouter = Router();

revenueMasterRouter.get('/', RevenueMasterController.getAllRevenues);
revenueMasterRouter.get('/:id', RevenueMasterController.getRevenueById);
revenueMasterRouter.post('/:oId', RevenueMasterController.createRevenue);
revenueMasterRouter.put('/:id', RevenueMasterController.updateRevenue);
revenueMasterRouter.delete('/:id', RevenueMasterController.deleteRevenue);

export default revenueMasterRouter;
