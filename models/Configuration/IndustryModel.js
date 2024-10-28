import mongoose from "mongoose";

const IndustryMasterSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    }
    ,
    description : {
        type : String
    }
},     {
    timestamps: true
})

const IndustryMasterModel = new mongoose.model("Industry",IndustryMasterSchema);
export default IndustryMasterModel;