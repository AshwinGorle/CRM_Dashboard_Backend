import mongoose from "mongoose";

const TerritorySchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
},    {
    timestamps: true
})

const TerritoryModel = new mongoose.model("Territory",TerritorySchema);
export default TerritoryModel;