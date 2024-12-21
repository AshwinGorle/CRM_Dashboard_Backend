import mongoose from "mongoose";

const OpportunityMasterSchema = new mongoose.Schema({
  customId: {
    type: String,
    default : null
    // required: true,
  },
  entryDate: {
    type: Date,
    required: true,
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  projectName: {
    type: String,
    required: true,
  },

  /////////////
  salesStage : {
    type: mongoose.Schema.Types.ObjectId,
    ref : "SalesStage"
  },
  salesSubStage : {
    type: mongoose.Schema.Types.ObjectId,
    ref : "SalesSubStage"
  },

  //totalRevenue    derived
  totalRevenue : {
    type : Number,
    default : 0
  },
  
  stageHistory : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "StageHistory",
    default : []
  }]
  //confidence * totalRevenue

}, {timestamps : true});

const OpportunityMasterModel = new mongoose.model(
  "OpportunityMaster",
  OpportunityMasterSchema
);
export default OpportunityMasterModel;
