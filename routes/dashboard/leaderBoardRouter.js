import { Router } from "express";
import LeaderBoardController from "../../controllers/Dashboards/LeaderBoardController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const leaderBoardRouter = Router();

const entity = "LEADERBOARD";
leaderBoardRouter.post(
  "/",
  checkPermissions(entity, actionTypes.ALL_VIEW),
  LeaderBoardController.getLeaderBoard
);

export default leaderBoardRouter;
