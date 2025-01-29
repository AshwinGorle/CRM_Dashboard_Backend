import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OpportunityMaster",
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "ClientMaster" },
    description: {
      type: String,
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
