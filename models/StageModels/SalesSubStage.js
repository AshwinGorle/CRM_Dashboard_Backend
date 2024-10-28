import mongoose from "mongoose";

const SalesSubStageSchema = new mongoose.Schema({
    salesStage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SalesStage',
    },
    label : {
        type : String,
        require : true,
    },
    description : {
        type : String
    },
    message : {
        type : String
    },
    level : {
        type : Number
    }
})

const SalesSubStageModel = new mongoose.model("SalesSubStage",SalesSubStageSchema);
export default SalesSubStageModel;