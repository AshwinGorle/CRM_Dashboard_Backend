import { Router } from "express";
import staffRouter from "./staffRouter.js";
import TeamController from "../../controllers/TeamMaster/teamController.js";

const teamRouter =  Router();

teamRouter.use("/staff", staffRouter);
teamRouter.get("/",TeamController.getAllTeam)
teamRouter.get("/:id",TeamController.getTeamById)
teamRouter.post("/",TeamController.createTeam)
teamRouter.put("/:id",TeamController.updateTeam)
teamRouter.delete("/:id",TeamController.deleteTeam)
teamRouter.post("/:id",TeamController.addMember)
teamRouter.delete("/remove/:id",TeamController.removeMember)

export default teamRouter;