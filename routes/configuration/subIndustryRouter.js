import { Router } from "express";
import SubIndustryController from "../../controllers/Configuration/subIndustryController.js";
const subIndustryRouter = Router();

subIndustryRouter.get('/', SubIndustryController.getAllSubIndustry);
subIndustryRouter.get('/:id', SubIndustryController.getSubIndustryById);
subIndustryRouter.post('/', SubIndustryController.createSubIndustry);
subIndustryRouter.put('/:id', SubIndustryController.updateSubIndustry);
subIndustryRouter.delete('/:id', SubIndustryController.deleteSubIndustry);

export default subIndustryRouter;
