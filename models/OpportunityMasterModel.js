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
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'ClientMaster'
  },
  partneredWith: {
    type: String,
  },
  projectName: {
    type: String,
    required: true,
  },
  associatedTender: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "TenderMaster"
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
  /////////////
  
  //salesTopLine derived
  salesTopLine : {
     type : Number,
  },
  
  offsets : {
    type: Number,
  },

  revenue : [{
    type: mongoose.Schema.Types.ObjectId,
    ref : "RevenueMaster"
  }],
  
  //totalRevenue    derived
  totalRevenue : {
    type : Number,
    default : 0
  },

  confidenceLevel : {
    type: Number,
    min: 0,    // Minimum value of 0
    max: 100,  // Maximum value of 100
    default : 100
  },

  //Expected Sales derived
  expectedSales : {
    type : Number,
    default : 0
  },

  //Expected Sales derived
  expectedWonDate : {
    type : Date,
    default : null
  },

  openingDate : {
    type : Date,
    default : new Date(Date.now())
  },
  
  closingDate : {
    type : Date,
    default : null
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

// to restrict the association of a tender with multiple
OpportunityMasterSchema.pre("save", async function (next) {
  if (this.isModified("associatedTender")) {
    const existingOpportunity = await OpportunityMasterModel.findOne({
      associatedTender: this.associatedTender,
    });
    if (existingOpportunity) {
      const error = new Error(
        `The tender ${this.associatedTender} is already associated with another opportunity.`
      );
      return next(error);
    }
  }
  next();
});

export default OpportunityMasterModel;
