import mongoose from "mongoose";

const IndustryMasterSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    }
    ,
    description : {
        type : String
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},     {
    timestamps: true
})

const IndustryMasterModel = new mongoose.model("Industry",IndustryMasterSchema);
export default IndustryMasterModel;