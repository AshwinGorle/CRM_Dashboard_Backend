import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    permissions: [
      {
        entity: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Entity",
          required: true,
        },
        allowedActions: [{ type: String }], // Store action types
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to normalize the name to uppercase
RoleSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.trim().toUpperCase();
  }
  next();
});

// Unique index for name
RoleSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Role", RoleSchema);
