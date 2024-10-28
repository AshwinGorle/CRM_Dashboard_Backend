import { Router } from "express";
import OpportunityController from "../../controllers/Opportunity/opportunityController.js";
import revenueMasterRouter from "./revenueRoute.js";
const opportunityRouter = Router();

opportunityRouter.use('/revenue', revenueMasterRouter);
opportunityRouter.get('/', OpportunityController.getAllOpportunities)
opportunityRouter.get('/:id', OpportunityController.getOpportunityById)
opportunityRouter.post('/', OpportunityController.createOpportunity)
opportunityRouter.put('/:id', OpportunityController.updateOpportunity)
opportunityRouter.delete('/:id', OpportunityController.deleteOpportunity)

export default opportunityRouter;