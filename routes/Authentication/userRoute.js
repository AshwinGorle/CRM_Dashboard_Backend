import { Router } from "express";
import UserController from "../../controllers/Authentication/userController.js";
import uploadSteam from "../../utils/memoryStorage.utils.js";
import checkPermissions from "../../middlewares/checkPermission.js";
const userRouter = Router();

const entity = "USER";
userRouter.get("/", UserController.getAllUser);
userRouter.get(
  "/:id",
  (req, res, next) =>
    checkPermissions(entity, "READ", req.params.id)(req, res, next),
  UserController.getUser
);
userRouter.post("/", uploadSteam.single("avatar"), UserController.createUser);
userRouter.put("/:id", uploadSteam.single("avatar"), UserController.updateUser);
userRouter.delete("/", UserController.deleteUser);

export default userRouter;
