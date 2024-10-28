import { Router } from "express";
import pipeViewRouter from "./pipeViewRoute.js";

const dashboardRouter = Router();

dashboardRouter.use('/pipe-view', pipeViewRouter);


export default dashboardRouter;
