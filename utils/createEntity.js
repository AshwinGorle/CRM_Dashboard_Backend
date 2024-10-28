import PermissionModel from "../models/PermissionModel.js";

export const createPermissionEntity = async (roleName) => {
    const permission = new PermissionModel({
        entity: roleName,
        actions: ["create", "read", "update", "delete", "get-all"],
    });

    await permission.save();
    return permission;
};
