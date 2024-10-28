import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        permissions: [{
            entity: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission', required: true },
            allowedActions: [{ type: String }] // Store action types
        }]
    }, { timestamps: true }
);

const RoleModel = mongoose.model("Role", RoleSchema);

export default RoleModel;
