import mongoose from "mongoose";
import ClientMasterModel from "../models/ClientMasterModel.js";
import StaffModel from "../models/StaffModel.js";
import RelationshipDegreeModel from "../models/ConfigModels/ContactMaster/RelationshipDegreeModel.js";
import ArchetypeModel from "../models/ConfigModels/ContactMaster/ArchetypeModel.js";

// Map to associate field names with models
const modelMap = {
    enteredBy: StaffModel,
    client: ClientMasterModel,
    archType: ArchetypeModel,
    relationshipDegree: RelationshipDegreeModel,
    // Add other mappings as needed
};

const validateContact = async (req, res, next) => {
    const idsToCheck = [
        { id: req.body.enteredBy, field: 'enteredBy' },
        { id: req.body.client, field: 'client' },
        { id: req.body.archType, field: 'archType' },
        { id: req.body.relationshipDegree, field: 'relationshipDegree' },
    ];

    const invalidIds = idsToCheck.filter(({ id }) => !mongoose.Types.ObjectId.isValid(id));

    if (invalidIds.length) {
        return res.status(400).json({ status: 'failed', message: `Invalid IDs: ${invalidIds.map(item => item.field).join(', ')}` });
    }

    try {
        // Validate existence in the database
        for (const { id, field } of idsToCheck) {
            const model = modelMap[field];
            const document = await model.findById(id);

            if (!document) {
                return res.status(404).json({ status: 'failed', message: `ID for ${field} does not exist in the database.` });
            }
        }

        next();
    } catch (err) {
        return res.status(500).json({ status: 'failed', message: 'Server error while validating IDs.', error: err.message });
    }
};

// Usage in a route
export default validateContact;
