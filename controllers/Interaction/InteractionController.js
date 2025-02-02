import mongoose from "mongoose";
import InteractionModel from "../../models/InteractionModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import {
  ClientError,
} from "../../utils/customErrorHandler.utils.js";


class InteractionController {
  static createInteraction = async ({ leadId, session }) => {
    if (!leadId) {
      throw new ClientError("Lead id is required to create interaction");
    }

    const newInteraction = new InteractionModel({ lead: leadId });

    await newInteraction.save({ session });

    return newInteraction;
  };

  /**
   * Update Interaction
   */
  static updateInteraction = catchAsyncError(async (req, res, next, session) => {
    const { id } = req.params;
    const { description, interactions, potentialTopLine, potentialOffset } = req.body;
  
    console.log("interactions ------", interactions);
  
    const interaction = await InteractionModel.findById(id);
    if (!interaction) {
      throw new ClientError("Interaction not found.");
    }
  
    // Helper function to validate ObjectId
    const toObjectId = (id) => {
      if (!id || typeof id !== "string") return null;
      return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
    };
  
    let validatedInteractions = [];
    if (Array.isArray(interactions)) {
      for (const i of interactions) {
        if (!i.contact || !i.conversation) {
          throw new ClientError("Each interaction must have a contact and conversation.");
        }
        
        const contactId = toObjectId(i.contact);
        if (!contactId) throw new ClientError(`Invalid Contact ID: ${i.contact}`);
  
        validatedInteractions.push({
          contact: contactId,
          conversation: i.conversation,
        });
      }
    }
  
    // Apply updates
    if (interactions) interaction.interactions = validatedInteractions;
    if (description) interaction.description = description;
    if (potentialTopLine) interaction.potentialTopLine = potentialTopLine;
    if (potentialOffset) interaction.potentialOffset = potentialOffset;
  
    await interaction.save({ session });
  
    // Populate correctly
    const populatedInteraction = await InteractionModel.findById(interaction._id)
      .populate("lead")
      .populate("interactions.contact", "firstName lastName avatar email phone")
      .session(session)
  
    res.status(200).json({
      status: "success",
      message: "Interaction updated successfully.",
      data: populatedInteraction,
    });
  }, true);
  

  /**
   * Get Single Interaction by ID
   */
  static getInteraction = catchAsyncError(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ClientError("Invalid Interaction ID.");
    }

    const interaction = await InteractionModel.findById(id)
      .populate("lead") // Populate lead details
      .populate(
        "interactions"
      ).session(session)
    if (!interaction) {
      throw new ClientError("Interaction not found.");
    }

    res.status(200).json({
      status: "success",
      message: "Interaction fetched successfully.",
      data: interaction,
    });
  });

  static getAllInteractions = catchAsyncError(async (req, res) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const interactions = await InteractionModel.find()
      .limit(limit)
      .skip(skip)
      .populate("lead", "name") // Populate lead details
      .populate("interactions.contact", "firstName lastName avatar email phone") // Populate contacts in interactions
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Interactions fetched successfully.",
      data: interactions,
    });
  });
}

export default InteractionController;
