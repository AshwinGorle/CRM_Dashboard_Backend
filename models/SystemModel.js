import mongoose from "mongoose";

const systemSchema = new mongoose.Schema({
    wonSalesStage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SalesStage',
        default : null
    },
    submittedTenderStage : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Stage',
        default : null
    }
})

const SystemModel = mongoose.model('System', systemSchema);
export default SystemModel;