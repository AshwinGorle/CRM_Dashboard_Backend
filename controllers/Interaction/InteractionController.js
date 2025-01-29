import mongoose from "mongoose";
import InteractionModel from "../../models/InteractionModel.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import ContactMasterModel from "../../models/ContactMasterModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ClientError } from "../../utils/customErrorHandler.utils.js";

class InteractionController {
  /**
   * Create Interaction
   */
  static createInteraction = catchAsyncError(async (req, res) => {
    const {
      opportunity,
      client,
      description,
      interactions,
      potentialTopLine,
      potentialOffset,
      potentialRevenue,
    } = req.body;

    // Required field validation
    if (!client || !opportunity || !description || !Array.isArray(interactions)) {
      throw new ClientError("All fields, including interactions, are required.");
    }

    // Convert string IDs to ObjectId
    const toObjectId = (id) =>
      mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : null;

    const opportunityId = toObjectId(opportunity);
    const clientId = toObjectId(client);

    if (!opportunityId || !clientId) {
      throw new ClientError("Invalid Opportunity or Client ID.");
    }

    // Validate existence of Opportunity & Client
    const opportunityExists = await OpportunityMasterModel.findById(opportunityId);
    if (!opportunityExists) throw new ClientError("Opportunity not found.");

    const clientExists = await ClientMasterModel.findById(clientId);
    if (!clientExists) throw new ClientError("Client not found.");

    // Validate and transform interactions
    const validatedInteractions = [];
    for (const interaction of interactions) {
      if (!interaction.contact || !interaction.conversation) {
        throw new ClientError("Each interaction must have a contact and conversation.");
      }

      const contactId = toObjectId(interaction.contact);
      if (!contactId) throw new ClientError("Invalid Contact ID.");

      const contactExists = await ContactMasterModel.findById(contactId);
      if (!contactExists) throw new ClientError("Contact not found.");

      validatedInteractions.push({ contact: contactId, conversation: interaction.conversation });
    }

    // Create new interaction document
    const newInteraction = new InteractionModel({
      opportunity: opportunityId,
      client: clientId,
      description,
      interactions: validatedInteractions,
      potentialTopLine,
      potentialOffset,
      potentialRevenue,
    });

    await newInteraction.save();

    res.status(201).json({
      status: "success",
      message: "Interaction created successfully.",
      data: newInteraction,
    });
  });

  /**
   * Update Interaction
   */
  static updateInteraction = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const {
      opportunity,
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

    const opportunityId = opportunity ? toObjectId(opportunity) : interaction.opportunity;
    const clientId = client ? toObjectId(client) : interaction.client;

    // Validate existence of Opportunity & Client if updated
    if (opportunityId && opportunityId.toString() !== interaction.opportunity.toString()) {
      const opportunityExists = await OpportunityMasterModel.findById(opportunityId);
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
          throw new ClientError("Each interaction must have a contact and conversation.");
        }

        const contactId = toObjectId(interaction.contact);
        if (!contactId) throw new ClientError("Invalid Contact ID.");

        const contactExists = await ContactMasterModel.findById(contactId);
        if (!contactExists) throw new ClientError("Contact not found.");

        validatedInteractions.push({ contact: contactId, conversation: interaction.conversation });
      }
    }

    // Update interaction document
    interaction.opportunity = opportunityId;
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
      .populate("opportunity", "projectName") // Populate opportunity details
      .populate("client", "name") // Populate client details
      .populate("interactions.contact", "firstName lastName avatar  email phone"); // Populate contacts in interactions

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
    const interactions = await InteractionModel.find()
      .populate("opportunity", "name") // Populate opportunity details
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
