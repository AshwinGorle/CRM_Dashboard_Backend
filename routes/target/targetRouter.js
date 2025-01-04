import { Router } from "express";
import TargetController from "../../controllers/Target/TargetController.js";

const targetRouter = Router();

targetRouter.post('/', TargetController.getTargetController); // used to get target
targetRouter.post('/set', TargetController.setTargetController); // used for both update and create


export default targetRouter;
