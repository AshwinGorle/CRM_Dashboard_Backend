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
    salesChamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    potentialRevenue: {
        type : Number,
        default : 0
    }

},{timestamps : true})

const BusinessDevelopmentModel = new mongoose.model("BusinessDevelopment", BusinessDevelopmentSchema);
export default BusinessDevelopmentModel;