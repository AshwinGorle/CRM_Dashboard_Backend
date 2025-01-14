import mongoose from "mongoose";
import RegistrationMasterModel from "../../models/RegistrationMasterModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ClientError, ServerError } from "../../utils/customErrorHandler.utils.js";
import {
  getFilterOptions,
  getSortingOptions,
} from "../../utils/searchOptions.js";
import { populate } from "dotenv";

class RegistrationMasterController {
  // Create a new RegistrationMaster entry
  static createRegistrationMaster = catchAsyncError(async (req, res, next) => {
    const {
      client,
      entryDate,
      enteredBy = req.user._id,
      registrationChamp,
      status,
      websiteDetails,
      otherDetails,
      registrationDate,
      expiryDate,
      primaryContact,
      submittedDocuments,
      notes,
      createdAt,
    } = req.body;

    // Validate required fields
    if (
      !client ||
      !registrationChamp ||
      !status ||
      !websiteDetails?.username ||
      !websiteDetails?.password ||
      !websiteDetails?.link ||
      !primaryContact
    ) {
      return res.status(400).json({
        status: "failed",
        message: "All required fields must be filled",
      });
    }

    // Create a new instance of the RegistrationMasterModel
    const newRegistration = new RegistrationMasterModel({
      client,
      entryDate,
      enteredBy,
      registrationChamp,
      status,
      websiteDetails,
      otherDetails,
      registrationDate,
      expiryDate,
      primaryContact,
      submittedDocuments,
      notes,
      createdAt,
    });

    // Save the instance
    await newRegistration.save();
    res.status(201).json({
      status: "success",
      message: "Registration created successfully",
      data: newRegistration,
    });
  });

  // Get all RegistrationMaster entries
  static getAllRegistrationMasters = catchAsyncError(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const filterOptions = getFilterOptions(req.query);
    const sortingOptions = getSortingOptions(req.query);
    const totalCount = await RegistrationMasterModel.countDocuments(
      filterOptions
    );
    const registrationMasters = await RegistrationMasterModel.find(
      filterOptions
    )
      .sort(sortingOptions)
      .skip(skip)
      .limit(limit)
      .populate("client")
      .populate("enteredBy")
      .populate("registrationChamp")
      .populate("primaryContact")
      .populate("status");

    res.status(200).json({
      status: "success",
      message: "All RegistrationMasters retrieved successfully",
      data: { page, limit, totalCount, registrations: registrationMasters },
    });
  });

  // Get a RegistrationMaster by ID
  static getRegistrationMasterById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const registrationMaster = await RegistrationMasterModel.findById(id)
      // .populate("client")
      .populate("enteredBy");
    // .populate("registrationChamp")
    // .populate("primaryContact");

    if (!registrationMaster)
      throw new ServerError("NotFound", "RegistrationMaster");

    res.status(200).json({
      status: "success",
      message: "RegistrationMaster retrieved successfully",
      data: registrationMaster,
    });
  });

  // Update a RegistrationMaster by ID
  static updateRegistrationMaster = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    console.log("update registration data---", updateData);
    const registrationMaster = await RegistrationMasterModel.findById(id);
    if (!registrationMaster)
      throw new ServerError("NotFound", "RegistrationMaster");

    Object.keys(updateData).forEach((key) => {
      if (key == "link" || key == "username" || key == "password") {
        registrationMaster.websiteDetails[key] = updateData[key];
      } else {
        registrationMaster[key] = updateData[key];
      }
    });

    const updatedRegistrationMaster = await registrationMaster.save();

    res.status(200).json({
      status: "success",
      message: "RegistrationMaster updated successfully",
      data: updatedRegistrationMaster,
    });
  });

  // Delete a RegistrationMaster by ID
  static deleteRegistrationMaster = catchAsyncError(async (req, res, next, session) => {
    console.log("delete registration ")
    const { id } = req.params;
    let { confirm } = req.query;
    confirm = confirm == "true" ? true : false;
    console.log("confirm-------",confirm)
    if (!confirm) {
      const registration = await RegistrationMasterModel.findById(id)
      .populate("registrationChamp", "firstName lastName avatar")
      .populate("enteredBy", "firstName lastName avatar")
      .populate("status")
      .populate({
        path: "client",
        populate: [
          { path: "enteredBy", select: "firstName lastName avatar" },
          { path: "primaryRelationship", select: "firstName lastName avatar" },
          {
            path: "secondaryRelationship",
            select: "firstName lastName avatar",
          },
          { path: "territory" },
          { path: "industry" },
          { path: "subIndustry" },
          { path: "incorporationType" },
          { path: "classification" },
          { path: "relationshipStatus" },
        ],
      });
      if (!registration)
        throw new ClientError("NotFound", "Registration not found!");

      return res.status(200).send({
        status: "success",
        message: "Registration and related entires fetched successfully",
        data: {
          confirm,
          registration
        },
      });
    }

    const registration = await RegistrationMasterModel.findByIdAndDelete(
      id
    ).populate("enteredBy").session(session);

    if (!registration)
      throw new ClientError("NotFound", "Registration not found!");

    res.status(200).send({
      status: "success",
      message: "RegistrationMaster deleted successfully",
      data: {
        confirm,
        registration
      },
    });
  }, true);
}

export default RegistrationMasterController;
