import mongoose from "mongoose";

const tenderStageSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    }
})

const TenderStageModel = new mongoose.model("Stage",tenderStageSchema);
export default TenderStageModel;