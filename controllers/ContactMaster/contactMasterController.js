import mongoose from "mongoose";
import { clientError } from "../../config/responseMessage.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import ContactMasterModel from "../../models/ContactMasterModel.js";
import { ClientError, ServerError } from "../../utils/customErrorHandler.utils.js";
import uploadAndGetAvatarUrl from "../../utils/uploadAndGetAvatarUrl.utils.js";
import { getFilterOptions, getSortingOptions } from "../../utils/searchOptions.js";
import BusinessDevelopmentModel from "../../models/BusinessDevelopmentModel.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import RegistrationMasterModel from "../../models/RegistrationMasterModel.js";
import { handleClientChange } from "../../service/contactService.js";

class ContactMasterController {
  static createContact = catchAsyncError(async (req, res, next) => {
    let {
      gender,
      entryDate,
      enteredBy = req?.user?._id,
      firstName,
      lastName,
      client,
      jobTitle,
      phone,
      mobilePhone,
      phoneCountryCode,
      mobileCountryCode,
      workEmail,
      personalEmail,
      archeType,
      relationshipDegree,
      memorableDetail,
      detailsConfirmation,
      notes,
      city,
      state,
      country,
      territory,
      createdAt,
    } = req.body;

    // Validate required fields
    if (!gender || !firstName || !lastName || !jobTitle || !mobilePhone) {
      return res.status(400).json({
        status: "failed",
        message: "All required fields must be filled",
      });
    }

    // Manual validation for entryDate
    entryDate = new Date(entryDate);
    if (isNaN(entryDate.getTime())) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid entryDate" });
    }

    // Create a new instance of the ContactMasterModel
    const address = {
      city: city || "NA",
      state: state || "NA",
      country: country || "NA",
    };
    const newContact = await new ContactMasterModel({
      gender,
      entryDate,
      enteredBy,
      firstName,
      lastName,
      client,
      jobTitle,
      phone,
      mobilePhone,
      phoneCountryCode,
      mobileCountryCode,
      workEmail,
      personalEmail,
      archeType,
      relationshipDegree,
      address,
      country,
      memorableDetail,
      detailsConfirmation,
      notes,
      territory,
      createdAt,
    });
    if (req.file) {
      newContact.avatar = await uploadAndGetAvatarUrl(
        req.file,
        "contact",
        newContact._id,
        "stream"
      );
    }
    // Save the instance
    await newContact.save();
    const populatedContact = await ContactMasterModel.findById(newContact._id)
      .populate("enteredBy")
      .populate("client")
      .populate("archeType")
      .populate("relationshipDegree")
      .populate("territory");

    res.status(201).json({
      status: "success",
      message: "Contact created successfully",
      data: populatedContact,
    });
  });

  static getAllContacts = catchAsyncError(async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const filterOptions = getFilterOptions(req.query);
    const sortingOptions = getSortingOptions(req.query);
    const { config } = req.query;
    if (config === "true") {
      const contacts = await ContactMasterModel.find(filterOptions).select(
        "firstName lastName"
      );
      return res.send({
        status: "success",
        message: "Config contacts fetched successfully",
        data: { config: true, contacts },
      });
    }
    const totalCount = await ContactMasterModel.countDocuments(filterOptions);
    const contacts = await ContactMasterModel.find(filterOptions)
      .sort(sortingOptions)
      .limit(limit)
      .skip(skip)
      .populate("enteredBy")
      .populate("client")
      .populate("archeType")
      .populate("relationshipDegree")
      .populate("territory");

    res.status(200).json({
      status: "success",
      message: "All Contacts retrieved successfully--",
      data: { page, limit, totalCount, contacts },
    });
  });

  static getContactById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const contact = await ContactMasterModel.findById(id)
      .populate("enteredBy")
      .populate("client")
      .populate("archeType")
      .populate("relationshipDegree")
      .populate("territory");

    if (!contact) throw new ServerError("NotFound", "Contact");

    res.status(200).json({
      status: "success",
      message: "Contact retrieved successfully",
      data: contact,
    });
  });

  static updateContact = catchAsyncError(async (req, res, next, session) => {
    console.log("update interred");
    const { id } = req.params;
    const updateData = req.body;
    console.log("update data for contact ", updateData);

    const contact = await ContactMasterModel.findById(id);
    if (!contact) throw new ServerError("NotFound", "Contact");
    
    //Updating directly updatable fields
    Object.keys(updateData).forEach((key) => {
      if (key == "city" || key == "state") {
        contact["address"][key] = updateData[key];
      } else {
        if(key != 'client')
         contact[key] = updateData[key];
      }
    });
    
    //Handling profile change
    if (req.file) {
      contact.avatar = await uploadAndGetAvatarUrl(
        req.file,
        "contact",
        contact._id,
        "stream"
      );
    }
    console.log("contact before save ", contact);

    //Handling client change
    if(updateData.client) await handleClientChange({clientId : updateData.client, contactId : id, session })

    await contact.save({session});

    const populatedContact = await ContactMasterModel.findById(contact._id)
      .populate("enteredBy")
      .populate("client")
      .populate("archeType")
      .populate("relationshipDegree")
      .populate("territory")
      .session(session)

    res.status(200).json({
      status: "success",
      message: "Contact updated successfully",
      data: populatedContact,
    });
  }, true);

  static deleteContact = catchAsyncError(async (req, res, next, session) => {
    const { id } = req.params;
    let { confirm } = req.query;
    confirm = confirm === "true";
    console.log("in delete contact-----------")
    // Part 1: If `confirm` is false, return related details without deleting anything
    if (!confirm) {
      // Step 1: Fetch the contact while populating all its fields and validate its existence
      const contact = await ContactMasterModel.findById(id)
        .populate("enteredBy", "firstName lastName avatar")
        .populate("client", "name avatar")
        .populate("relationshipDegree")
        .populate("territory")
        .exec();
  
      if (!contact) {
        throw new ClientError("NotFound","Contact not found");
      }
  
      // Step 2: Fetch business developments where the contact is used
      const businessDevelopments = await BusinessDevelopmentModel.find({ contact: id })
        .populate("client", "name avatar")
        .populate("enteredBy", "firstName lastName avatar")
        .populate("salesChamp", "firstName lastName avatar")
        .exec();
  
      // Step 3: Fetch clients where this contact is included in `relatedContacts`
      const clients = await ClientMasterModel.find({ relatedContacts: id })
        .populate("enteredBy", "firstName lastName avatar")
        .populate("primaryRelationship", "firstName lastName avatar")
        .populate("secondaryRelationship", "firstName lastName avatar")
        .populate("industry territory subIndustry")
        .exec();
  
      // Step 4: Fetch registrations where this contact is in the `primaryContact` field
      const registrations = await RegistrationMasterModel.find({ primaryContact: id })
        .populate("enteredBy", "firstName lastName avatar")
        .populate("registrationChamp", "firstName lastName avatar")
        .populate("client", "name avatar")
        .exec();
  
      // Step 5: Return the data without performing deletions
      return res.status(200).json({
        status: "success",
        message: "Contact-related entries fetched successfully",
        data: { contact, clients, businessDevelopments, registrations, confirm },
      });
    }
  
    // Part 2: If `confirm` is true, perform the actual deletion
    // Step 1: Fetch the contact and validate its existence
    const contact = await ContactMasterModel.findById(id).exec();
    if (!contact) {
      throw  new ClientError("NotFound","contact not found");
    }
  
    // Step 2: Set the `contact` field to null in related business developments
    const businessDevelopments = await BusinessDevelopmentModel.updateMany(
      { contact: id },
      { $set: { contact: null } },
      { session }
    ).exec();
  
    // Step 3: Remove the contact ID from the `relatedContacts` array in clients
    const clients = await ClientMasterModel.updateMany(
      { relatedContacts: id },
      { $pull: { relatedContacts: id } },
      { session }
    ).exec();
  
    // Step 4: Set the `primaryContact` field to null in related registrations
    const registrations = await RegistrationMasterModel.updateMany(
      { primaryContact: id },
      { $set: { primaryContact: null } },
      { session }
    ).exec();
  
    // Step 5: Delete the contact
    await ContactMasterModel.findByIdAndDelete(id, { session }).exec();
    console.log("deletion success -------")
    // Return the response with deleted and updated documents
    return res.status(200).send({
      status: "success",
      message: "Contact deleted while settling related entries",
      data: { contact, clients, businessDevelopments, registrations, confirm },
    });
  }, true);
  
}

export default ContactMasterController;
