import { Router } from "express";
import IndustryController from "../../controllers/Configuration/industryController.js";
const industryRouter = Router();

industryRouter.get('/', IndustryController.getAllIndustry);
industryRouter.get('/:id', IndustryController.getIndustryById);
industryRouter.post('/', IndustryController.createIndustry);
industryRouter.put('/:id', IndustryController.updateIndustry);
industryRouter.delete('/:id', IndustryController.deleteIndustry);

export default industryRouter;

