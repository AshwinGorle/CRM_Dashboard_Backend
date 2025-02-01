import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  { 
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    interactions : [
        {
            contact :  { type: mongoose.Schema.Types.ObjectId, ref: "ContactMaster" },
            conversation : {type : String}
        }
    ],
    potentialTopLine: {
      type: Number,
    },
    potentialOffset: {
      type: Number,
    },
    potentialRevenue: {
      type: Number,
    },
  },
  { timestamps: true }
);

const InteractionModel = mongoose.model("Interaction", interactionSchema);

export default InteractionModel;
