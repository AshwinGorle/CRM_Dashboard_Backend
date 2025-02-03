import { Router } from "express";
import InteractionController from "../../controllers/Interaction/InteractionController.js";
import { actionTypes } from "../../config/actionTypes.js";
import checkPermissions from "../../middlewares/checkPermission.js";

const interactionRouter = Router();
const entity = "INTERACTION";

// interactionRouter.get(
//   "/:id",
//   checkPermissions(entity, actionTypes.READ),
//   InteractionController.getInteraction
// );

// interactionRouter.get(
//   "/",
//   checkPermissions(entity, actionTypes.GET_ALL),
//   InteractionController.getAllInteractions
// );

// interactionRouter.post(
//   "/",
//   checkPermissions(entity, actionTypes.CREATE),
//   InteractionController.createInteraction
// );

interactionRouter.put(
  "/:id",
  checkPermissions(entity, actionTypes.CREATE),
  InteractionController.updateInteraction
);

export default interactionRouter;
