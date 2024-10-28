import { Router } from "express";
import BusinessDevelopmentController from "../../controllers/Business Development/businessDevelopmentController.js";
const businessDevelopmentRouter = Router();

businessDevelopmentRouter.get('/', BusinessDevelopmentController.getAllBusinessDevelopments);
businessDevelopmentRouter.get('/:id', BusinessDevelopmentController.getBusinessDevelopmentById);
businessDevelopmentRouter.post('/', BusinessDevelopmentController.createBusinessDevelopment);
businessDevelopmentRouter.put('/:id', BusinessDevelopmentController.updateBusinessDevelopment);
businessDevelopmentRouter.delete('/:id', BusinessDevelopmentController.deleteBusinessDevelopment);

export default businessDevelopmentRouter;
