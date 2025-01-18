import mongoose from "mongoose";

const TerritorySchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    },isDeleted : {
        type : Boolean,
        default : false
    }
},    {
    timestamps: true
})

const TerritoryModel = new mongoose.model("Territory",TerritorySchema);
export default TerritoryModel;