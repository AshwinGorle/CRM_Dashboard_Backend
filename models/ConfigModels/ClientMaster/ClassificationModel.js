import mongoose from "mongoose";

const ClassificationSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
})

const ClassificationModel = new mongoose.model("Classification",ClassificationSchema);
export default ClassificationModel;