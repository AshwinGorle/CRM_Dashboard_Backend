import mongoose from "mongoose";

const EntitySchema = new mongoose.Schema(
  {
    entity: { type: String, required: true, trim: true, unique: true },
    actions: [{ type: String, required: true, trim: true }],
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: null,
    },
    label: { type: String, required: true, trim: true },
    description: { type: String },
  },
  { timestamps: true }
);

const EntityModel = mongoose.model("Entity", EntitySchema);

export default EntityModel;
