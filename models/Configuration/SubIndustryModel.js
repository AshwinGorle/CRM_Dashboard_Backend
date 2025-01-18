import mongoose from "mongoose";

const SubIndustrySchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},    {
    timestamps: true
})

const SubIndustryModel = new mongoose.model("SubIndustry",SubIndustrySchema);
export default SubIndustryModel;