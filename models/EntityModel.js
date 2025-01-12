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

EntitySchema.pre("save", function (next) {
  if (this.entity) {
    this.entity = this.entity.trim().toUpperCase();
  }
  next();
});

// Unique index for entity
EntitySchema.index({ entity: 1 }, { unique: true });

const EntityModel = mongoose.model("Entity", EntitySchema);

export default EntityModel;
