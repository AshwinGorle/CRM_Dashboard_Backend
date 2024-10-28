import mongoose, { Mongoose } from "mongoose";

const stageHistorySchema = new mongoose.Schema({
    stage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalesStage"
    },
    opportunity : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OpportunityMaster"
    },
    entryDate : {
        type : Date,
        required : true
    },
    exitDate : {
        type : Date,
    },
    subStageHistory : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "SubStageHistory"
    }]

});

const StageHistoryModel = new mongoose.model("StageHistory", stageHistorySchema);
export default StageHistoryModel;