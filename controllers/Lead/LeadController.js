import mongoose from "mongoose";
import LeadModel from "../../models/LeadModel.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import ContactMasterModel from "../../models/ContactMasterModel.js";
import SolutionModel from "../../models/Configuration/SolutionModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ClientError } from "../../utils/customErrorHandler.utils.js";
import { getOpportunityIdWithoutClient } from "../../service/opportunityService.js";
import {
  getFilterOptions,
  getSortingOptions,
} from "../../utils/searchOptions.js";
import InteractionController from "../Interaction/InteractionController.js";

class LeadController {
  /**
   * Create Lead
   */
  static createLead = catchAsyncError(async (req, res, next, session) => {
    const {
      projectName,
      client,
      contact,
      solution,
      description,
      source,
      salesTopLine,
      salesOffset,
    } = req.body;

    // Required field validation
    if (!projectName || !client || !description) {
      throw new ClientError("All fields are required.");
    }

    // Convert string IDs to ObjectId
    const toObjectId = (id) =>
      mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : null;

    const clientId = client ? toObjectId(client) : null;
    const contactId = contact ? toObjectId(contact) : null;
    const solutionId = solution ? toObjectId(solution) : null;

    // Validate reference existence in DB
    const validationChecks = [
      { id: clientId, model: ClientMasterModel, field: "Client" },
      { id: contactId, model: ContactMasterModel, field: "Contact" },
      { id: solutionId, model: SolutionModel, field: "Solution" },
    ];

    for (const check of validationChecks) {
      if (check.id) {
        const exists = await check.model.findById(check.id);
        if (!exists) {
          throw new ClientError(`${check.field} not found.`);
        }
      }
    }
    const customId = await getOpportunityIdWithoutClient(client);
    // Create new lead
    const newLead = new LeadModel({
      projectName,
      customId,
      client: clientId,
      contact: contactId,
      solution: solutionId,
      description,
      source,
      salesTopLine,
      salesOffset,
    });

    await newLead.save({ session });

    // creating interaction for the lead
    const interaction = await InteractionController.createInteraction({
      leadId: newLead._id,
      session,
    });

    // updating interaction into lead
    newLead.interaction = interaction._id;
    await newLead.save({ session });

    res.status(201).json({
      status: "success",
      message: "Lead created successfully.",
      data: newLead,
    });
  }, true);

  /**
   * Update Lead
   */
  static updateLead = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const {
      projectName,
      client,
      contact,
      solution,
      description,
      source,
      salesTopLine,
      salesOffset,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ClientError("Invalid Lead ID.");
    }

    const lead = await LeadModel.findById(id);
    if (!lead) {
      throw new ClientError("Lead not found.");
    }

    // Convert string IDs to ObjectId
    const toObjectId = (id) =>
      mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : null;

    const clientId = client ? toObjectId(client) : null;
    const contactId = contact ? toObjectId(contact) : null;
    const solutionId = solution ? toObjectId(solution) : null;

    // Validate reference existence in DB
    const validationChecks = [
      { id: clientId, model: ClientMasterModel, field: "Client" },
      { id: contactId, model: ContactMasterModel, field: "Contact" },
      { id: solutionId, model: SolutionModel, field: "Solution" },
    ];

    for (const check of validationChecks) {
      if (check.id) {
        const exists = await check.model.findById(check.id);
        if (!exists) {
          throw new ClientError(`${check.field} not found.`);
        }
      }
    }

    // Update lead details
    const updatedLead = await LeadModel.findByIdAndUpdate(
      id,
      {
        projectName,
        client: clientId,
        contact: contactId,
        solution: solutionId,
        description,
        source,
        salesTopLine,
        salesOffset,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      message: "Lead updated successfully.",
      data: updatedLead,
    });
  });

  /**
   * Get a Single Lead by ID
   */
  static getLead = catchAsyncError(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ClientError("Invalid Lead ID.");
    }

    const lead = await LeadModel.findById(id)
      .populate({
        path: "client",
        select: "name industry territory",
        populate: [
          { path: "industry", select: "label" }, // Populate industry with only the name field
          { path: "territory", select: "label" }, // Populate territory with only the name field
        ],
      })
      .populate("contact", "name email phone") // Populate contact details
      .populate("solution", "name"); // Populate solution field

    if (!lead) {
      throw new ClientError("Lead not found.");
    }

    res.status(200).json({
      status: "success",
      message: "Lead fetched successfully.",
      data: lead,
    });
  });

  static getAllLeads = catchAsyncError(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const filterOptions = getFilterOptions(req.query);
    const sortingOptions = getSortingOptions(req.query);
    const { config } = req.query;

    if (config === "true") {
      const leads = await LeadModel.find(filterOptions)
        .populate("client", "name")
        .populate("contact", "firstName lastName email phone")
        .populate("solution", "name")
        .populate({
          path: "interaction", 
          populate: {
            path: "interactions.contact", 
            select: "firstName lastName email phone",
          },
        })
        .sort(sortingOptions);

      return res.send({
        status: "success",
        message: "Config leads fetched successfully",
        data: { config: true, leads },
      });
    }

    const totalCount = await LeadModel.countDocuments(filterOptions);
    const leads = await LeadModel.find()
      .sort(sortingOptions)
      .limit(limit)
      .skip(skip)
      .populate("client", "name") // Populate client field with name
      .populate("contact", "firstName lastName email phone") // Populate contact details
      .populate("solution", "name") // Populate solution field
      .sort({ createdAt: -1 });

    return res.send({
      status: "success",
      message: "All leads retrieved successfully",
      data: { page, limit, totalCount, leads: leads },
    });
  });

  /**
   * Delete Lead by ID
   */
  static deleteLead = catchAsyncError(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ClientError("Invalid Lead ID.");
    }

    const lead = await LeadModel.findById(id);
    if (!lead) {
      throw new ClientError("Lead not found.");
    }

    await LeadModel.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Lead deleted successfully.",
    });
  });
}

export default LeadController;
