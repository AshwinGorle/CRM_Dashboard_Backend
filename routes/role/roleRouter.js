import { Router } from "express";
const roleRouter = Router();
import RoleController from "../../controllers/Role/RoleController.js";

roleRouter.get('/:id', RoleController.getRole); // get role details
roleRouter.get('/', RoleController.getAllRole); // get all roles
roleRouter.get('/permissions/get-all', RoleController.getAllPermissions); // get all permissions
roleRouter.post('/', RoleController.createRole); // create role
roleRouter.put('/:id', RoleController.updateRole); // update role
roleRouter.put('/edit-permissions/:id', RoleController.editRolePermissions); // edit role's permission
roleRouter.delete('/:id', RoleController.deleteRole); // delete role

export default roleRouter;