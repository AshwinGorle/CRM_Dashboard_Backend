import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import {
  ServerError,
  ClientError,
} from "../../utils/customErrorHandler.utils.js";
import RoleModel from "../../models/RoleModel.js";
import EntityModel from "../../models/EntityModel.js";
import {
  createEntity,
  updateEntity,
  deleteEntity,
} from "./roleEntityController.js";
import mongoose from "mongoose";
import UserModel from "../../models/UserModel.js";

class RoleController {
  static getAllRole = catchAsyncError(async (req, res, next) => {
    const totalCount = await RoleModel.countDocuments();

    // Fetch roles with pagination
    const roles = await RoleModel.find();

    console.log("req.user.role", req.user.role);

    const filteredRoles = roles?.filter((role) => role.name != "SUPER ADMIN");

    if (!filteredRoles || filteredRoles.length === 0) {
      throw new ServerError("NotFound", "Roles not found");
    }

    return res.status(200).json({
      status: "success",
      message: "All roles fetched successfully",
      data: { totalCount, roles: filteredRoles },
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

    res.status(200).json({
      status: "success",
      message: "Role fetched successfully",
      data: role,
    });
  });

  static createRole = catchAsyncError(async (req, res, next, session) => {
    const { roleName } = req.body;
    if (!roleName || roleName.trim() === "" || roleName.length >= 30) {
      throw new ClientError("InvalidInput", "Role name is required");
    }

    // remove all the spaces
    const normalizedRoleName = roleName.replace(/\s+/g, "").toUpperCase();

    const regexPattern = normalizedRoleName.split("").join("\\s*");
    const regex = new RegExp(`^${regexPattern}$`, "i");

    const existingRole = await RoleModel.findOne({
      name: { $regex: regex },
    }).session(session);
    const existingEntity = await EntityModel.findOne({
      entity: { $regex: regex },
    }).session(session);

    if (existingRole || existingEntity) {
      throw new ClientError("Duplicate", "Role name already exists");
    }

    const trimedName = roleName.trim().toUpperCase();
    // // Create new role
    const newRole = await RoleModel.create([{ name: trimedName }], {
      session,
    });

    // Create associated entity using the session
    await createEntity(newRole[0], session);

    // Send response
    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: newRole[0],
    });
  }, true);

  static editRolePermissions = catchAsyncError(
    async (req, res, next, session) => {
      try {
        const { id } = req.params;
        const { permissionUpdates } = req.body;

        if (!permissionUpdates || !Array.isArray(permissionUpdates)) {
          throw new ClientError(
            "InvalidInput",
            "Permission updates are required."
          );
        }

        if (id == req.user.role._id) {
          throw new ClientError(
            "Unauthorized",
            "You can't change your own role's permissions"
          );
        }

        // Fetch the role with permissions
        const role = await RoleModel.findById(id).session(session);
        if (!role || role?.name == "SUPER ADMIN") {
          throw new ClientError("NotFound", "Role not found.");
        }

        for (const update of permissionUpdates) {
          // Validate entity ID
          if (!mongoose.Types.ObjectId.isValid(update.entity)) {
            throw new ClientError(
              "InvalidId",
              "The provided permission entity ID is invalid."
            );
          }

          // Fetch the actual entity for validation
          const actualPermission = await EntityModel.findById(
            update.entity
          ).session(session);

          if (!actualPermission) {
            throw new ClientError(
              "NotFound",
              `Permission entity with ID ${update.entity} does not exist.`
            );
          }

          const actualActions = actualPermission.actions; // Get valid actions for the entity
          const invalidActions = update.allowedActions.filter(
            (action) => !actualActions.includes(action)
          );

          if (invalidActions.length > 0) {
            throw new ClientError(
              "InvalidAction",
              `The following actions are invalid for entity ${
                actualPermission.entity
              }: ${invalidActions.join(", ")}`
            );
          }

          // Check if permission exists in the role
          // const permissionIndex = role.permissions.findIndex(
          //   (perm) => perm.entity.toString() === update.entity.toString()
          // );

          // if (update.allowedActions.length === 0) {
          //   // If allowedActions is empty, remove the permission
          //   if (permissionIndex !== -1) {
          //     role.permissions.splice(permissionIndex, 1);
          //   }
          // } else {
          //   if (permissionIndex !== -1) {
          //     // Update existing permission
          //     role.permissions[permissionIndex].allowedActions =
          //       update.allowedActions;
          //   } else {
          //     // Add new permission
          //     role.permissions.push({
          //       entity: update.entity,
          //       allowedActions: update.allowedActions,
          //     });
          //   }
          // }
        }
        role.permissions = permissionUpdates;

        // Save the updated role
        const updatedRole = await role.save({ session });

        res.status(200).json({
          status: "success",
          message: "Permissions updated successfully.",
          data: updatedRole,
        });
      } catch (error) {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      }
    },
    true
  );

  static updateRole = catchAsyncError(async (req, res, next, session) => {
    const id = req.params.id;
    let { roleName } = req.body;

    if (id == req.user.role._id) {
      throw new ClientError("Unauthorized", "You can't update your own role");
    }

    if (!roleName || roleName.trim() === "" || roleName.length > 20) {
      throw new ClientError("InvalidInput", "Invalid role name!");
    }

    roleName = roleName.toUpperCase();
    const updatedRole = await RoleModel.findByIdAndUpdate(
      id,
      { name: roleName },
      { new: true, runValidators: true, session }
    );

    if (!updatedRole) {
      throw new ClientError("NotFound", "Role not found");
    }

    await updateEntity(updatedRole, session);

    res.status(200).json({
      status: "success",
      message: "Role updated successfully",
      data: updatedRole,
    });
  }, true);

  static deleteRole = catchAsyncError(async (req, res, next, session) => {
    const { id } = req.params;
    let { confirm } = req.query;
    confirm = confirm == "true";

    // Step 1: Find and validate the role to delete
    const role = await RoleModel.findById(id)
      .populate({
        path: "permissions.entity",
      })
      .session(session);

    if (!role) {
      throw new ClientError("NotFound", "Role not found");
    }

    // Step 2 Fetch all users with this role
    const users = await UserModel.find({ role: id }).session(session);
    if (!confirm) {
      return res.status(200).send({
        status: "success",
        message: "Role and related entries fetched successfully",
        data: { users, role, confirm },
      });
    }

    // Step 4: Update each user's role field to `null` and save them
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        user.role = null;
        return user.save({ session });
      })
    );

    // Step 5: Delete the role
    await RoleModel.findByIdAndDelete(id, { session });

    // Step 6: Respond with the deleted role and updated users
    res.status(200).json({
      status: "success",
      message: "Role deleted successfully, and related users updated",
      data: {
        role,
        user: updatedUsers,
        confirm,
      },
    });
  }, true);
}

export default RoleController;
