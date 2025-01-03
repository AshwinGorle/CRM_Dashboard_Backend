import { Router } from "express";
const roleRouter = Router();
import RoleController from "../../controllers/Role/RoleController.js";
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";

const entity = "ROLE";

roleRouter.get(
  "/:id",
  checkPermissions(entity, actionTypes.READ),
  RoleController.getRole
); // get role details

roleRouter.get(
  "/",
  checkPermissions(entity, actionTypes.GET_ALL),
  RoleController.getAllRole
); // get all roles

roleRouter.get(
  "/entities/get-all",
  checkPermissions(entity, actionTypes.READ),
  RoleController.getAllEntities
); // get all entities

roleRouter.post(
  "/",
  checkPermissions(entity, actionTypes.CREATE),
  RoleController.createRole
); // create role

roleRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  RoleController.updateRole
); // update role

roleRouter.put(
  "/edit-permissions/:id",
  checkPermissions(entity, actionTypes.UPDATE),
  RoleController.editRolePermissions
); // edit role's permission

roleRouter.delete(
  "/:id",
  checkPermissions(entity, actionTypes.DELETE),
  RoleController.deleteRole
); // delete role

export default roleRouter;
