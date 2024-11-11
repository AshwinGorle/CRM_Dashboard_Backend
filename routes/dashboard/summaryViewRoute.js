import { Router } from "express";
import SummaryViewController from "../../controllers/Dashboards/SummaryViewController.js";
const summaryViewRouter = Router();

summaryViewRouter.post('/', SummaryViewController.getSummaryView);
summaryViewRouter.post('/heat-map', SummaryViewController.getHeatMap);


export default summaryViewRouter;

