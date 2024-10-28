import { MongoGCPError } from "mongodb";
import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
    avatar : {
        type : String,
        default : ""
    },
    firstName : {
        type : String,
        require : true
    },
    lastName : {
        type : String,
        require : true
    },
    gender : {
        type : String,
        enum : ["M", "F", "O"]
    },
    DOB : {
        type : Date,
    },
    email : {
        type : String,
        require : true
    },
    phone : {
        type : String,
        require : true
    },
    address : {
        type : String,
        require : true
    },
    role : {
        type : String,
        default : "staff"
    },
    teams : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Team',
        default: []
    }]
})

const StaffModel = new mongoose.model("Staff", StaffSchema);
export default StaffModel;