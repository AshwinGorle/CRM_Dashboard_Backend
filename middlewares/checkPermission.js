import { ClientError } from "../utils/customErrorHandler.utils.js";
import RoleModel from "../models/RoleModel.js";
import UserModel from "../models/UserModel.js"; 

const checkPermissions = (resource, action, targetEntityId = null) => {
    return async (req, res, next) => {
        try {
            const userRoleId = req.user.roleId; 
            const role = await RoleModel.findById(userRoleId).populate('permissions.entity');

            if (!role) {
                throw new ClientError("Not Found", "Role not found.");
            }

            // Check if the resource is a user
            if (resource === "user") {
                if (!targetEntityId) {
                    throw new ClientError("BadRequest", "Target user ID is required.");
                }

                // Fetch the target user's role
                const targetUser = await UserModel.findById(targetEntityId).populate('role');
                if (!targetUser) {
                    throw new ClientError("Not Found", "Target user not found.");
                }

                // Use the target user's role name as the entity
                resource = targetUser.role.name; // Assuming role has a 'name' field

                // Now, proceed to check if the requesting user's role has permissions for this role (resource)
            }

            // Find the permission related to the resource (entity)
            const permission = role.permissions.find(perm => perm.entity.entity.toString() === resource);

            if (!permission) {
                throw new ClientError("Unauthorized", "You do not have permission to access this resource.");
            }

            // Check if the action is allowed
            if (!permission.allowedActions.includes(action)) {
                throw new ClientError("Unauthorized", "You do not have the required action permission.");
            }

            next();
        } catch (error) {
            return res.status(403).json({
                status: "error",
                message: error.message
            });
        }
    };
};

export default checkPermissions;
