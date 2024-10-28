import { Router } from "express";
import SolutionController from "../../controllers/Configuration/solutionController.js";
const solutionRouter = Router();

solutionRouter.get('/', SolutionController.getAllSolution);
solutionRouter.get('/:id', SolutionController.getSolutionById);
solutionRouter.post('/', SolutionController.createSolution);
solutionRouter.put('/:id', SolutionController.updateSolution);
solutionRouter.delete('/:id', SolutionController.deleteSolution);

export default solutionRouter;
