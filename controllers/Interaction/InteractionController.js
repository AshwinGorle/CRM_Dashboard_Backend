import mongoose from "mongoose";
import InteractionModel from "../../models/InteractionModel.js";

import ClientMasterModel from "../../models/ClientMasterModel.js";
import ContactMasterModel from "../../models/ContactMasterModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import {
  ClientError,
  ServerError,
} from "../../utils/customErrorHandler.utils.js";
import LeadModel from "../../models/LeadModel.js";
import {
  getFilterOptions,
  getSortingOptions,
} from "../../utils/searchOptions.js";

class InteractionController {
  static createInteraction = catchAsyncError(async ({ leadId, session }) => {
    if (!leadId) {
      throw new ServerError("Lead id are required to create interaction");
    }
    // Create new interaction document
    const newInteraction = new InteractionModel({
      lead: leadId,
    });

    await newInteraction.save({ session });

    return newInteraction;
  });

  /**
   * Update Interaction
   */
  static updateInteraction = catchAsyncError(
    async (req, res, next, session) => {
      const { id } = req.params;
      const {
        description,
        interactions,
        potentialTopLine,
        potentialOffset,
        potentialRevenue,
      } = req.body;

      const interaction = await InteractionModel.findById(id);
      if (!interaction) {
        throw new ClientError("Interaction not found.");
      }

      // Validate and replace interactions
      let validatedInteractions = interaction.interactions;
      if (Array.isArray(interactions)) {
        validatedInteractions = [];
        for (const interaction of interactions) {
          if (!interaction.contact || !interaction.conversation) {
            throw new ClientError(
              "Each interaction must have a contact and conversation."
            );
          }
          const contactId = toObjectId(interaction.contact);
          if (!contactId) throw new ClientError("Invalid Contact ID.");
          validatedInteractions.push({
            contact: contactId,
            conversation: interaction.conversation,
            date: interaction.data || null,
          });
        }
      }

      // Update interaction document
      if (description) interaction.description = description;
      if (interactions) interaction.interactions = validatedInteractions;
      if (potentialTopLine) interaction.potentialTopLine = potentialTopLine;
      if (potentialOffset) interaction.potentialOffset = potentialOffset;
      if (potentialRevenue) interaction.potentialRevenue = potentialRevenue;

      await interaction.save({ session });

      const populatedInteraction = await InteractionModel.findById(
        interaction._id
      )
        .populate("lead") // Populate lead details
        .populate("client", "name") // Populate client details
        .populate(
          "interactions.contact",
          "firstName lastName avatar  email phone",
          session
        )
        .session(session);

      res.status(200).json({
        status: "success",
        message: "Interaction updated successfully.",
        data: populatedInteraction,
      });
    },
    true
  );

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
      .populate("client", "name") // Populate client details
      .populate(
        "interactions.contact",
        "firstName lastName avatar  email phone"
      ); // Populate contacts in interactions

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
      .populate("client", "name") // Populate client details
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
