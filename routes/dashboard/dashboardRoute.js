import { Router } from "express";
import pipeViewRouter from "./pipeViewRoute.js";
import funnelViewRouter from "./funnelViewRoute.js";

const dashboardRouter = Router();

dashboardRouter.use('/pipe-view', pipeViewRouter);
dashboardRouter.use('/funnel-view', funnelViewRouter);


export default dashboardRouter;
