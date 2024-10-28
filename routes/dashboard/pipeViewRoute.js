import { Router } from "express";
import PipeViewController from "../../controllers/Dashboards/PipeViewController.js";
const pipeViewRouter = Router();

pipeViewRouter.post('/', PipeViewController.getPipeView);


export default pipeViewRouter;
