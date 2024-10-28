import mongoose, { Mongoose } from "mongoose";

const RegistrationMasterSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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
    registrationChamp: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "RegistrationStatus",
        required: true,
        // enum: ["Yet to initiate", "In progress", "Stalled - not able to register", "Registered", "Registration Expired"]
    },
    websiteDetails: {
        username: {
            type: String,
            // required: true
        },
        password: {
            type: String,
            // required: true
        },
        link : {
            type : String,
            // required : true
        }
    },
    otherDetails: {
        type: String
    },
    registrationDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    primaryContact: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ContactMaster"
    },
    submittedDocuments : {
        type : String,
    },
    notes: [{
        type: String
    }]
    // single or multiple
})

const RegistrationMasterModel = new mongoose.model("RegistrationMaster", RegistrationMasterSchema);
export default RegistrationMasterModel;