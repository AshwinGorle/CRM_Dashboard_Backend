import mongoose from "mongoose";

const OpportunityMasterSchema = new mongoose.Schema({
  entryDate: {
    type: Date,
    required: true,
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'ClientMaster'
  },
 
  projectName: {
    type: String,
    required: true,
  },
  
  solution: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "Solution"
  },
  subSolution: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "SubSolution"
  },
  salesChamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User"
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
  stageClarification : {
    type: String,
    required: true,
  },
  
  //totalRevenue    derived
  totalRevenue : {
    type : Number,
    default : 0
  },

  //Expected Sales derived
  expectedSales : {
    type : Number,
    default : 0
  },


  openingDate : {
    type : Date,
    default : new Date(Date.now())
  },
  
  closingDate : {
    type : Date,
    default : null
  },


  //confidence * totalRevenue

}, {timestamps : true});

const OpportunityMasterModel = new mongoose.model(
  "OpportunityMaster",
  OpportunityMasterSchema
);
export default OpportunityMasterModel;
