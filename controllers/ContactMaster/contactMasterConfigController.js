import { ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import ArchetypeModel from "../../models/ConfigModels/ContactMaster/ArchetypeModel.js";
import RelationshipDegreeModel from "../../models/ConfigModels/ContactMaster/RelationshipDegreeModel.js";
class ContactMasterConfigController{
      //--------------------------ArcheType------------------------
    static createArchetype = catchAsyncError(async (req, res, next) => {
        const { label } = req.body;
    
        const newArchetype = await ArchetypeModel.create({ label });
    
        res.status(201).json({
          status: "success",
          message: "Archetype created successfully",
          data: newArchetype,
        });
      });
    
      static updateArchetype = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
    
        const archetype = await ArchetypeModel.findById(id);
    
        if (!archetype) throw new ServerError("NotFound", "ArcheType")
    
        Object.keys(updateData).forEach((key) => {
          archetype[key] = updateData[key];
        });
        
        const updatedArchetype = await archetype.save();
    
        res.status(200).json({
          status: "success",
          message: "Archetype updated successfully",
          data: updatedArchetype,
        });
      });
    
      static deleteArchetype = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const archetype = await ArchetypeModel.findByIdAndDelete(id);
    
        if (!archetype) throw new ServerError("NotFound", "ArcheType")

    
        res.status(200).json({
          status: "success",
          message: "Archetype deleted successfully",
        });
      });
    
      static getAllArchetypes = catchAsyncError(async (req, res, next) => {
        const archetypes = await ArchetypeModel.find();
    
        res.status(200).json({
          status: "success",
          message: "All archetypes fetched successfully",
          data: archetypes,
        });
      });
    
      static getArchetypeById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const archetype = await ArchetypeModel.findById(id);
    
        if (!archetype) throw new ServerError("NotFound", "ArcheType")
    
        res.status(200).json({
          status: "success",
          message: "Archetype fetched successfully",
          data: archetype,
        });
      });

      //-----------------------------RelationShipDegree------------------------

      static createRelationshipDegree = catchAsyncError(async (req, res, next) => {
        const { label, description } = req.body;
    
        const newRelationshipDegree = await RelationshipDegreeModel.create({ label, description });
    
        res.status(201).json({
          status: "success",
          message: "Relationship Degree created successfully",
          data: newRelationshipDegree,
        });
      });
    
      // Update an existing Relationship Degree
      static updateRelationshipDegree = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const updateData = req.body;
    
        const relationshipDegree = await RelationshipDegreeModel.findById(id);
        if (!relationshipDegree) throw new ServerError("NotFound", "Relationship Degree");
    
        Object.keys(updateData).forEach((key) => {
          relationshipDegree[key] = updateData[key];
        });
        
        const updatedRelationshipDegree = await relationshipDegree.save();
    
        res.status(200).json({
          status: "success",
          message: "Relationship Degree updated successfully",
          data: updatedRelationshipDegree,
        });
      });
    
      // Delete a Relationship Degree
      static deleteRelationshipDegree = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const relationshipDegree = await RelationshipDegreeModel.findByIdAndDelete(id);
    
        if (!relationshipDegree) throw new ServerError("NotFound", "Relationship Degree");
    
        res.status(200).json({
          status: "success",
          message: "Relationship Degree deleted successfully",
        });
      });
    
      // Get all Relationship Degrees
      static getAllRelationshipDegrees = catchAsyncError(async (req, res, next) => {
        const relationshipDegrees = await RelationshipDegreeModel.find();
    
        res.status(200).json({
          status: "success",
          message: "All Relationship Degrees fetched successfully",
          data: relationshipDegrees,
        });
      });
    
      // Get Relationship Degree by ID
      static getRelationshipDegreeById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const relationshipDegree = await RelationshipDegreeModel.findById(id);
    
        if (!relationshipDegree) throw new ServerError("NotFound", "Relationship Degree");
    
        res.status(200).json({
          status: "success",
          message: "Relationship Degree fetched successfully",
          data: relationshipDegree,
        });
      });
}

export default ContactMasterConfigController;