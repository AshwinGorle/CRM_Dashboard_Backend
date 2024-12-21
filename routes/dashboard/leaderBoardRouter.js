import { Router } from "express";
import LeaderBoardController from "../../controllers/Dashboards/LeaderBoardController.js";

const leaderBoardRouter = Router();


leaderBoardRouter.post('/', LeaderBoardController.getLeaderBoard);

export default leaderBoardRouter;