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
  static updateInteraction = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const {
      lead,
      client,
      description,
      interactions,
      potentialTopLine,
      potentialOffset,
      potentialRevenue,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ClientError("Invalid Interaction ID.");
    }

    const interaction = await InteractionModel.findById(id);
    if (!interaction) {
      throw new ClientError("Interaction not found.");
    }

    // Convert string IDs to ObjectId
    const toObjectId = (id) =>
      mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : null;

    const leadId = lead ? toObjectId(lead) : interaction.lead;
    const clientId = client ? toObjectId(client) : interaction.client;

    // Validate existence of Opportunity & Client if updated
    if (leadId && leadId.toString() !== interaction.lead.toString()) {
      const opportunityExists = await LeadModal.findById(leadId);
      if (!opportunityExists) throw new ClientError("Opportunity not found.");
    }

    if (clientId && clientId.toString() !== interaction.client.toString()) {
      const clientExists = await ClientMasterModel.findById(clientId);
      if (!clientExists) throw new ClientError("Client not found.");
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

        const contactExists = await ContactMasterModel.findById(contactId);
        if (!contactExists) throw new ClientError("Contact not found.");

        validatedInteractions.push({
          contact: contactId,
          conversation: interaction.conversation,
        });
      }
    }

    // Update interaction document
    interaction.lead = leadId;
    interaction.client = clientId;
    interaction.description = description;
    interaction.interactions = validatedInteractions;
    interaction.potentialTopLine = potentialTopLine;
    interaction.potentialOffset = potentialOffset;
    interaction.potentialRevenue = potentialRevenue;

    await interaction.save();

    res.status(200).json({
      status: "success",
      message: "Interaction updated successfully.",
      data: interaction,
    });
  });

  /**
   * Get Single Interaction by ID
   */
  static getInteraction = catchAsyncError(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ClientError("Invalid Interaction ID.");
    }

    const interaction = await InteractionModel.findById(id)
      .populate("lead", "projectName") // Populate lead details
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

  /**
   * Get All Interactions
   */
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
