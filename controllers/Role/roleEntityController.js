import EntityModel from "../../models/EntityModel.js";

export const createEntity = async (role, session) => {
  try {
    const entity = new EntityModel({
      entity: role.name,
      label: role.name,
      roleId: role._id,
      actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
    });

    await entity.save({ session });
    return entity;
  } catch (error) {
    console.log("Error in create role entity", error);
    throw error;
  }
};

export const updateEntity = async (role, session) => {
  try {
    const updatedEntity = await EntityModel.findOneAndUpdate(
      {
        roleId: role._id, // Search condition
      },
      {
        entity: role.name, // Data to update or set
        label: role.name,
        roleId: role._id, // Ensure roleId is set in case of creation
        actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"], // Include default actions if creating new
      },
      {
        new: true, // Return the updated or newly created entity
        runValidators: true, // Validate the schema before saving
        upsert: true, // Create a new document if none matches the condition
        session,
      }
    );

    return updatedEntity;
  } catch (error) {
    console.error("Error in updating/creating role entity:", error);
    throw error;
  }
};

export const deleteEntity = async (role, session) => {
  try {
    // Find and delete the entity based on role ID
    const deletedEntity = await EntityModel.findOneAndDelete(
      {
        roleId: role._id,
      },
      { session }
    );

    // Return the deleted entity (or null if not found)
    return deletedEntity;
  } catch (error) {
    console.error("Error in deleting role entity:", error);
    throw error;
  }
};
