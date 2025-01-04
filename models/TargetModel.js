import mongoose from "mongoose";

const TargetSchema = new mongoose.Schema({
    entityType: {
        type: String,
        required: true,
        enum: ["Territory", "Industry", "Solution"], // Allows targeting multiple entity types
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "entityType", // Dynamically references the corresponding entity model
    },
    year: {
        type: Number,
        required: true,
    },
    targets: {
        q1: { type: Number, default: 0 },
        q2: { type: Number, default: 0 },
        q3: { type: Number, default: 0 },
        q4: { type: Number, default: 0 },
    },
}, { timestamps: true });

const TargetModel = mongoose.model("Target", TargetSchema);
export default TargetModel;
