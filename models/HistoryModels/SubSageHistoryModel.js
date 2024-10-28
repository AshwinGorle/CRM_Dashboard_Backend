import mongoose, { Mongoose } from "mongoose";

const subStageHistorySchema = new mongoose.Schema({
    subStage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalesSubStage"
    },
    
    entryDate : {
        type : Date,
        required : true
    },
    

});

const SubStageHistoryModel = new mongoose.model("SubStageHistory", subStageHistorySchema);
export default SubStageHistoryModel;