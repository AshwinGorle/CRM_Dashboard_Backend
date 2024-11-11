import { Router } from "express";
import pipeViewRouter from "./pipeViewRoute.js";
import funnelViewRouter from "./funnelViewRoute.js";
import summaryViewRouter from "./summaryViewRoute.js";

const dashboardRouter = Router();

dashboardRouter.use('/pipe-view', pipeViewRouter);
dashboardRouter.use('/funnel-view', funnelViewRouter);
dashboardRouter.use('/summary-view', summaryViewRouter);


export default dashboardRouter;
