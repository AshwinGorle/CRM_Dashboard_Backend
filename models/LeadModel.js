import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    projectName: { type: String, default: "", require: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "ClientMaster" },
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactMaster",
    },
    customId : {type : String, default : null},
    // territory: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "Territory",
    // },
    // industry: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   // required : true,
    //   ref: "Industry",
    // },
    solution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Solution",
    },
    description : {
        type : String
    },
    source : {
        type : String
    },
    salesTopLine : {
        type : Number,
    },
    salesOffset : {
        type : Number,
    }
  },
  { timestamps: true }
);

const LeadModel = mongoose.model("Lead", leadSchema);

export default LeadModel;
