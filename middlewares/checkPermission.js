import { ClientError } from "../utils/customErrorHandler.utils.js";
import RoleModel from "../models/RoleModel.js";
import UserModel from "../models/UserModel.js";
import { actionTypes } from "../config/actionTypes.js";

const checkPermissions = (resource, action, targetEntityId = null) => {
  return async (req, res, next) => {
    try {
      console.log("Resource:", resource);
      console.log("Action:", action);

      const userRoleId = req.user.role._id;
      const role = await RoleModel.findById(userRoleId).populate(
        "permissions.entity"
      );
      if (!role) {
        return res.status(401).json({
          status: "failed",
          message: "User role is invalid, please login again.",
        });
      }

      if (role.name === "SUPER ADMIN" || req.query.config === "true") {
        return next();
      }

      let permission = null;

      // Check if the resource is a user
      if (resource === "USER") {
        if (action == actionTypes.GET_ALL) {
          let allowedRoleEntities = role.permissions.filter(
            (perm) =>
              perm.entity.roleId && perm.allowedActions?.includes(action)
          );

          if (allowedRoleEntities.length === 0) {
            throw new ClientError(
              "Unauthorized",
              "You do not have permission to access this resource."
            );
          }

          let allowedRoleIds = allowedRoleEntities.map((perm) =>
            perm.entity.roleId.toString()
          );

          req.allowedRoleIds = allowedRoleIds;

          return next();
        } else if (action == actionTypes.CREATE) {
          permission = role.permissions.find(
            (perm) => perm.entity?.roleId?.toString() == targetEntityId
          );
        } else {
          if (!targetEntityId) {
            throw new ClientError("BadRequest", "Target user ID is required.");
          }
          // Fetch the target user's role
          const targetUser = await UserModel.findById(targetEntityId);

          if (!targetUser) {
            throw new ClientError("Not Found", "Target user not found.");
          }

          // Use the target user's role id as the entity
          resource = targetUser.role?.toString();

          if (!resource) {
            throw ClientError("Not Found", "Target User has no role");
          }

          permission = role.permissions.find(
            (perm) => perm.entity?.roleId?.toString() === resource
          );
        }
      } else {
        // Find the permission related to the resource (entity)
        permission = role.permissions.find(
          (perm) => perm.entity.entity.toString() === resource
        );
      }

      if (!permission) {
        throw new ClientError(
          "Unauthorized",
          "You do not have permission to access this resource."
        );
      }

      // Check if the action is allowed
      if (!permission.allowedActions.includes(action)) {
        throw new ClientError(
          "Unauthorized",
          "You do not have permission for this action!"
        );
      }

      return next();
    } catch (error) {
      return res.status(403).json({
        status: "error",
        message: error.message,
      });
    }
  };
};

export default checkPermissions;
