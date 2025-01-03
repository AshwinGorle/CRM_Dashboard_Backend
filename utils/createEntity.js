import EntityModel from "../models/EntityModel.js";

export const createEntity = async (entityName, role) => {
  const entity = new EntityModel({
    entity: entityName,
    label: entityName,
    roleId: role._id,
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  });

  await entity.save();
  return entity;
};
