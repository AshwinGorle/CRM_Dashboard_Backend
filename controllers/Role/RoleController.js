import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import {
  ServerError,
  ClientError,
} from "../../utils/customErrorHandler.utils.js";
import RoleModel from "../../models/RoleModel.js";
import EntityModel from "../../models/EntityModel.js";
import { createEntity } from "../../utils/createEntity.js";
import mongoose from "mongoose";

class RoleController {
  static getAllRole = catchAsyncError(async (req, res, next) => {
    const totalCount = await RoleModel.countDocuments();

    // Fetch roles with pagination
    const roles = await RoleModel.find();

    if (!roles || roles.length === 0) {
      throw new ServerError("NotFound", "Roles not found");
    }

    return res.status(200).json({
      status: "success",
      message: "All roles fetched successfully",
      data: { totalCount, roles },
    });
  });

  static getAllEntities = catchAsyncError(async (req, res, next) => {
    const entities = await EntityModel.find();

    if (!entities || entities.length === 0) {
      throw new ServerError("NotFound", "Entities not found");
    }

    res.status(200).json({
      status: "success",
      message: "Entities fetched successfully",
      data: entities,
    });
  });

  // static getRole = async (roleName) => {
  //     const role = await RoleModel.findOne({ name: roleName }).populate('permissions.entity').lean();

  //     if (!role) {
  //         return next(new ServerError("RoleNotFound", "The role with the specified ID was not found."));
  //     }

  //     const permissionsWithAllowedActions = role.permissions.map(permissionEntry => {
  //         const permission = permissionEntry.entity;

  //         return {
  //             entity: permission.entity,
  //             allowedActions: permissionEntry.allowedActions
  //         };
  //     });

  //     return {
  //         name: role.name,
  //         permissions: permissionsWithAllowedActions
  //     };
  // };

  static getRole = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ClientError("InvalidId", "The provided role ID is invalid.")
      );
    }

    const role = await RoleModel.findById(id);

    if (!role) {
      return next(
        new ServerError(
          "RoleNotFound",
          "The role with the specified ID was not found."
        )
      );
    }

    // const permissionsWithAllowedActions = role.permissions.map(permissionEntry => {
    //     const permission = permissionEntry.entity;

    //     return {
    //         entity: permission.entity,
    //         allowedActions: permissionEntry.allowedActions
    //     };
    // });

    // role.permissions = permissionsWithAllowedActions;

    res.status(200).json({
      status: "success",
      message: "Role fetched successfully",
      data: role,
    });
  });

  static createRole = catchAsyncError(async (req, res, next, session) => {
    let { roleName } = req.body;
    if (!roleName || roleName.trim() === "" || roleName.length >= 30) {
      throw new ClientError("InvalidInput", "Role name is required");
    }

    roleName = roleName.toUpperCase();

    const existingRole = await RoleModel.findOne({ roleName });
    const existingEntity = await EntityModel.findOne({ entity: roleName });
    if (existingRole || existingEntity) {
      throw new ClientError("Duplicate", "Role name already exists");
    }

    // Create new role
    const newRole = await RoleModel.create({ name: roleName });

    await createEntity(roleName, newRole);

    // Send response
    res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: newRole,
    });
  });

  static editRolePermissions = catchAsyncError(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { permissionUpdates } = req.body;
      console.log(" permission updates 1 : ", permissionUpdates);
      // Fetch the role with populated permissions
      const role = await RoleModel.findById(id);

      if (!role) {
        throw new ClientError("Not Found", "Role not found.");
      }
      // Validate allowedActions for each update
      for (const update of permissionUpdates) {
        const permission = role.permissions.find(
          (perm) => perm.entity.toString() === update.entity.toString()
        );

        if (!mongoose.Types.ObjectId.isValid(update.entity)) {
          return next(
            new ClientError(
              "InvalidId",
              "The provided permission entity ID is invalid."
            )
          );
        }
        const actualPermission = await EntityModel.findById(update.entity);

        if (!actualPermission) {
          throw new ClientError(
            "Not Found",
            "The specified permission entity does not exist."
          );
        }

        const actualActions = actualPermission.actions; // Get the actual actions for the entity

        // Check if allowedActions are valid
        const invalidActions = update.allowedActions.filter(
          (action) => !actualActions.includes(action)
        );
        if (invalidActions.length > 0) {
          throw new ClientError(
            "Invalid Action",
            `The following actions are not valid: ${invalidActions.join(", ")}`
          );
        }

        if (permission) {
          // Update allowedActions if valid
          permission.allowedActions = update.allowedActions; // Update allowedActions
        } else {
          // If permission doesn't exist, Push a new permission entry
          role.permissions.push({
            entity: update.entity,
            allowedActions: update.allowedActions,
          });
        }
      }

      // Save the updated role
      const updatedRole = await role.save();

      res.status(201).json({
        status: "success",
        message: "Permissions edited successfully.",
        data: updatedRole,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  });

  static updateRole = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const { roleName } = req.body;
    console.log("role name", roleName);
    console.log("role id", id);
    roleName.toUpperCase();
    const role = await RoleModel.findByIdAndUpdate(id, { name: roleName });
    res.status(201).json({
      status: "success",
      message: "Role updated successfully",
      data: role,
    });
  });

  static deleteRole = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const role = await RoleModel.findByIdAndDelete(id);
    res.status(201).json({
      status: "success",
      message: "Role deleted successfully",
      data: role,
    });
  });
}

export default RoleController;
