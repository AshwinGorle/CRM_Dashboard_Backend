import { Router } from "express";
import FunnelViewController from "../../controllers/Dashboards/FunnelViewController.js";
const funnelViewRouter = Router();

funnelViewRouter.post('/', FunnelViewController.getFunnelView);


export default funnelViewRouter;

