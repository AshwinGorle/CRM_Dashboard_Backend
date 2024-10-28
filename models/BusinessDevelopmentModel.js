import mongoose, { Mongoose } from "mongoose";

const BusinessDevelopmentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClientMaster"
    },
    entryDate: {
        type: Date,
        required: true
    },
    enteredBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContactMaster"
    },
    connectionSource: {
        type: String
    },
    potentialProject: {
        type: String
    },
    solution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution"
    },
    subSolution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSolution"
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry"
    },
    territory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Territory"
    },
    salesChamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    potentialTopLine: {
        type: Number
    },
    potentialOffset: {
        type: Number
    },
    potentialRevenue: {
        type : Number,
        default : 0
    },
    comment : {
      type : String
    },
    Notes: [{
        type: String
    }]


})

const BusinessDevelopmentModel = new mongoose.model("BusinessDevelopment", BusinessDevelopmentSchema);
export default BusinessDevelopmentModel;