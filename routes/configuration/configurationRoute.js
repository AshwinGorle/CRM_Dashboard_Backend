import { Router } from "express";
import industryRouter from "./industryRoute.js";
import salesStateRouter from "../Stage/salesStageRoute.js";
import salesSubStageRouter from "../Stage/salesSubStageRoute.js";
import solutionMasterRouter from "./solutionRoute.js";
import subSolutionRouter from "./subSolutionRoute.js";
import subIndustryMasterRouter from "./subIndustryRouter.js";
import territoryRouter from "./territoryRoute.js";
import ConfigurationController from "../../controllers/Configuration/configurationController.js";
const configurationRoute = Router();
configurationRoute.use("/count", ConfigurationController.getCount);
configurationRoute.use('/industry', industryRouter);
configurationRoute.use('/sub-industry', subIndustryMasterRouter);
configurationRoute.use('/sales-stage', salesStateRouter);
configurationRoute.use('/sales-sub-stage', salesSubStageRouter);
configurationRoute.use('/solution', solutionMasterRouter);
configurationRoute.use('/sub-solution', subSolutionRouter);
configurationRoute.use('/territory', territoryRouter);

export default configurationRoute;

