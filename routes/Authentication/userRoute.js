import { Router } from "express";
import UserController from "../../controllers/Authentication/userController.js";
import uploadSteam from "../../utils/memoryStorage.utils.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";
const userRouter = Router();

const entity = "TEAM";
userRouter.get(
  "/profile",
  (req, res, next) =>
    checkPermissions(entity, actionTypes.READ, req.params.id)(req, res, next),
  UserController.getUserProfile
);

userRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  UserController.getAllUser
);
userRouter.get(
  "/:id",
  (req, res, next) =>
    checkPermissions(entity, actionTypes.READ, req.params.id)(req, res, next),
  UserController.getUser
);
userRouter.post(
  "/",
  (req, res, next) =>
    checkPermissions(entity, actionTypes.CREATE, req.body.role)(req, res, next),
  uploadSteam.single("avatar"),
  UserController.createUser
);
userRouter.put(
  "/:id",
  (req, res, next) =>
    checkPermissions(entity, actionTypes.UPDATE, req.params.id)(req, res, next),
  uploadSteam.single("avatar"),
  UserController.updateUser
);
userRouter.delete(
  "/:id",
  (req, res, next) =>
    checkPermissions(entity, actionTypes.DELETE, req.params.id)(req, res, next),
  UserController.deleteUser
);

export default userRouter;
