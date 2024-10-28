import { Router } from "express";
import StaffController from "../../controllers/TeamMaster/staffController.js";
import uploadStream from "../../utils/memoryStorage.utils.js";
const staffRouter = Router();

staffRouter.get("/", StaffController.getAllStaff)
staffRouter.get("/:id", StaffController.getStaff)
staffRouter.post("/", uploadStream.single('avatar'), StaffController.createStaff)
staffRouter.put("/:id", uploadStream.single('avatar'),StaffController.updateStaff)
staffRouter.delete("/:id",StaffController.deleteStaff);

export default staffRouter; 