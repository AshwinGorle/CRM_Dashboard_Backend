import mongoose from "mongoose";

const systemSchema = new mongoose.Schema({
    wonStage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SalesStage',
        default : null
    },
    tenderSubmittedStage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Stage',
        default : null
    }
})

const SystemModel = mongoose.model('System', systemSchema);
export default SystemModel;