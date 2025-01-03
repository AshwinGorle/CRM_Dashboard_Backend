import { ClientError } from "../utils/customErrorHandler.utils.js";
import RoleModel from "../models/RoleModel.js";
import UserModel from "../models/UserModel.js";

const checkPermissions = (resource, action, targetEntityId = null) => {
  return async (req, res, next) => {
    try {
      const userRoleId = req.user.role._id;
      console.log("req.user", req.user);
      const role = await RoleModel.findById(userRoleId).populate(
        "permissions.entity"
      );
      console.log("checking-role-permission", role);
      if (!role) {
        return res.status(401).json({
          status: "failed",
          message: "User role is invalid, please login again.",
        });
      }

      // Check if the resource is a user

      let permission = null;

      if (resource === "USER") {
        if (!targetEntityId) {
          throw new ClientError("BadRequest", "Target user ID is required.");
        }

        // Fetch the target user's role
        const targetUser = await UserModel.findById(targetEntityId);
        console.log("Target User", targetUser);
        if (!targetUser) {
          throw new ClientError("Not Found", "Target user not found.");
        }

        // Use the target user's role name as the entity
        resource = targetUser.role?.toString();
        if (!resource) {
          throw ClientError("Not Found", "Target User has no role");
        }
        console.log(role.permissions[0]);
        permission = role.permissions.find(
          (perm) => perm.entity?.roleId?.toString() === resource
        );
        console.log("permission-USER-RESOURCE", permission);
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
          "You do not have the required action permission."
        );
      }

      next();
    } catch (error) {
      return res.status(403).json({
        status: "error",
        message: error.message,
      });
    }
  };
};

export default checkPermissions;
