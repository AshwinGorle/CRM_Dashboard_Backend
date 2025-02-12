import mongoose from "mongoose";
import EntityModel from "../models/EntityModel.js";
import RoleModel from "../models/RoleModel.js";

const Entities = [
  {
    entity: "OPPORTUNITY",
    label: "DEAL",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "TENDER",
    label: "TENDER",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "LEAD",
    label: "LEAD",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "INTERACTION",
    label: "INTERACTION",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "BUSINESS DEVELOPMENT",
    label: "MENTION",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "CLIENT",
    label: "CLIENT",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "CONTACT",
    label: "CONTACT",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "REGISTRATION",
    label: "REGISTRATION",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "CONFIGURATION",
    label: "CONFIGURATION",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "TARGET",
    label: "SET TARGET",
    actions: ["YES"],
  },
  {
    entity: "ROLE",
    label: "ROLE",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "TEAM",
    label: "TEAM",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "PIPE VIEW",
    label: "PIPE VIEW",
    actions: ["MY VIEW", "ALL VIEW"],
  },
  {
    entity: "FUNNEL VIEW",
    label: "FUNNEL VIEW",
    actions: ["MY VIEW", "ALL VIEW"],
  },
  {
    entity: "SUMMARY VIEW",
    label: "SUMMARY VIEW",
    actions: ["ALL VIEW"],
  },
  {
    entity: "TREND VIEW",
    label: "TREND VIEW",
    actions: ["ALL VIEW"],
  },
  {
    entity: "LEADERBOARD",
    label: "LEADERBOARD",
    actions: ["ALL VIEW"],
  },
  {
    entity: "ACCOUNT MANAGEMENT",
    label: "ACCOUNT MANAGEMENT",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "CUSTOMER 360",
    label: "CUSTOMER 360",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "INCENTIVE",
    label: "INCENTIVE",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
  {
    entity: "TASK",
    label: "TASK",
    actions: ["CREATE", "READ", "UPDATE", "DELETE", "GET ALL"],
  },
];

const fixedRoles = [
  {
    name: "SUPER ADMIN",
    permissions: [],
  },
  {
    name: "ADMIN",
    permissions: [],
  },
];

// const insertFixedRoles = async () => {
//   try {
//     const insert = await RoleModel.insertMany(fixedRoles);
//     console.log(insert, "Fixed Role inserted successfully");
//   } catch (error) {
//     console.error("Error inserting predefined entities:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// insertFixedRoles();
// to insert all entities
// const insertEntities = async () => {
//   try {
//     const insert = await EntityModel.insertMany(Entities);
//     console.log(insert, "Predefined entities inserted successfully");
//     mongoose.connection.close();
//   } catch (err) {
//     console.error("Error inserting predefined entities:", err);
//     mongoose.connection.close();
//   }
// };
// insertEntities();

// const insertEntity = async (entity) => {
//   try {
//     const insert = await EntityModel.create(entity);
//     console.log(insert, "New entity inserted successfully");
//   } catch (err) {
//     console.error("Error inserting predefined entity:", err);
//   }
// };

// insertEntity({
//   entity: "TARGET",
//   label: "SET TARGET",
//   actions: ["ALLOW"],
// });

// to update entities
// const updateEntity = async (entity) => {
//   try {
//     const updated = await EntityModel.findOneAndUpdate(
//       { entity },
//       { actions: ["CREATE"] }
//     );
//     console.log(updated, "entity updated successfully");
//   } catch (err) {
//     console.error("Error inserting predefined entity:", err);
//   }
// };

// updateEntity("INTERACTION");

// to get all entities
// const getAllEntities = async () => {
//   try {
//     const result = await EntityModel.find();
//     console.log(result, "result");
//   } catch (error) {
//     console.log(error, "error");
//   }
// };
// getAllEntities().then(() => {
//   console.log("All entities fetched successfully");
// });

// to delete all existing entities --
// const deleteAllEntities = async () => {
//   await EntityModel.deleteMany({});
//   console.log("All entity deleted");
// };
// deleteAllEntities()
//   .then(() => process.exit(0))
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });

// to get all roles
// const getAllRoles = async () => {
//   try {
//     const roles = await RoleModel.find();
//     console.log(roles, "roles");
//   } catch (error) {
//     console.log(error, "error");
//   }
// };
// getAllRoles().then(() => {
//   console.log("All roles fetched successfully");
// });

// to delete all role permissions ---
// const deleteAllRolePermissions = async () => {
//   await RoleModel.updateMany({}, { permissions: [] });
// };
// deleteAllRolePermissions().then(() => {
//   console.log("All role permissions deleted");
// });
