import ClassificationModel from "../../models/ConfigModels/ClientMaster/ClassificationModel.js";
import { getClassification } from "../../utils/client.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import IncorporationTypeModel from "../../models/ConfigModels/ClientMaster/IncorporationTypeModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import RelationshipStatusModel from "../../models/ConfigModels/ClientMaster/RelationshipStatusModel.js";
class ClientMasterConfigController {
  static getClassificationById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const classification = await ClassificationModel.findById(id);
    if (!classification) throw new ServerError("NotFound", "classification");
    res.status(200).json({
      status: "success",
      message : "classification fetched successfully",
      data: classification,
    });
  });
  
  static getAllClassifications = catchAsyncError(async (req, res, next) => {
    const classifications = await ClassificationModel.find();
    res.status(200).json({
      status: "success",
      message : "all classification fetched successfully",
      data: classifications,
    });
  });

  static createClassification = catchAsyncError(async (req, res, next) => {
    const { label, description } = req.body;

    const classification = await ClassificationModel.create({
      label,
      description,
    });

    res.status(201).json({
      status: "success",
      message: "Classification created successfully",
      data: classification,
    });
  });

  static updateClassification = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const classification = await ClassificationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!classification) throw new ServerError("NotFound", "classification");
    
    res.status(200).json({
      status: "success",
      message: "Classification updated successfully",
      data: classification,
    });
  });

  static deleteClassification = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const  classification = await getClassification(classificationId);
    await ClassificationModel.findByIdAndDelete(
      id
    );
    res.status(200).json({
      status: "success",
      message: "Classification deleted successfully",
      data : classification
    });
  });
  //-----------------------------------IncorporationType-------------------------
  
  static getIncorporationTypeById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const incorporationType = await IncorporationTypeModel.findById(id);
    if (!incorporationType) throw new ServerError("NotFound", "incorporationType");
    res.status(200).json({
      status: "success",
      message: "Incorporation type found successfully",
      data: incorporationType,
    });
  });

  static getAllIncorporationTypes = catchAsyncError(async (req, res, next) => {
    const incorporationTypes = await IncorporationTypeModel.find();
    
    res.status(200).json({
      status: "success",
      message : "All Incorporation type fetched successfully",
      data: incorporationTypes,
    });
  });

  static createIncorporationType = catchAsyncError(async (req, res, next) => {
    const { label } = req.body;

    const incorporationType = await IncorporationTypeModel.create({ label });

    res.status(201).json({
      status: "success",
      message: "Incorporation Type created successfully",
      data: incorporationType,
    });
  });

  static updateIncorporationType = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    const incorporationType = await IncorporationTypeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!incorporationType) throw new ServerError("NotFound", "incorporationType");

    res.status(200).json({
      status: "success",
      message: "Incorporation Type updated successfully",
      data: incorporationType,
    });
  });
  
  static deleteIncorporationType = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const incorporationType = await IncorporationTypeModel.findByIdAndDelete(
      id
    );

    if (!incorporationType) throw new ServerError("NotFound", "incorporationType");

    res.status(200).json({
      status: "success",
      message: "Incorporation Type deleted successfully",
      data : incorporationType
    });
  });

  //-----------------------------------RelationshipStatus-------------------------

  static createRelationshipStatus = catchAsyncError(async (req, res, next) => {
    const { label } = req.body;

    const newRelationshipStatus = await RelationshipStatusModel.create({ label });

    res.status(201).json({
        status: "success",
        message: "Relationship status created successfully",
        data: newRelationshipStatus,
    });
});

static getAllRelationshipStatus = catchAsyncError(async (req, res, next) => {
    const relationshipStatuses = await RelationshipStatusModel.find();
   
    res.status(200).json({
        status: "success",
        message: "All relationship statuses retrieved successfully",
        data: relationshipStatuses,
    });
});

static getRelationshipStatusById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const relationshipStatus = await RelationshipStatusModel.findById(id);

    if (!relationshipStatus) throw new ServerError("NotFound", "RelationshipStatus")

    res.status(200).json({
        status: "success",
        message: "Relationship status retrieved successfully",
        data: relationshipStatus,
    });
});

static updateRelationshipStatus = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    const relationshipStatus = await RelationshipStatusModel.findById(id);

    if (!relationshipStatus) throw new ServerError("NotFound", "RelationshipStatus")

    Object.keys(updateData).forEach((key) => {
        relationshipStatus[key] = updateData[key];
    });

    const updatedRelationshipStatus = await relationshipStatus.save();

    res.status(200).json({
        status: "success",
        message: "Relationship status updated successfully",
        data: updatedRelationshipStatus,
    });
});

static deleteRelationshipStatus = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const relationshipStatus = await RelationshipStatusModel.findById(id);
    if (!relationshipStatus) throw new ServerError("NotFound", "RelationshipStatus")

    await RelationshipStatusModel.findByIdAndDelete(id);

    res.status(200).json({
        status: "success",
        message: "Relationship status deleted successfully",
        data : relationshipStatus
    });
});
}

export default ClientMasterConfigController;
