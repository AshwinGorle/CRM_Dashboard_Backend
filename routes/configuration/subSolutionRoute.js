import { Router } from "express";
import SubSolutionController from "../../controllers/Configuration/subSolutionController.js";
const subSolutionRouter = Router();

subSolutionRouter.get('/', SubSolutionController.getAllSubSolution);
subSolutionRouter.get('/:id', SubSolutionController.getSubSolutionById);
subSolutionRouter.post('/', SubSolutionController.createSubSolution);
subSolutionRouter.put('/:id', SubSolutionController.updateSubSolution);
subSolutionRouter.delete('/:id', SubSolutionController.deleteSubSolution);

export default subSolutionRouter;