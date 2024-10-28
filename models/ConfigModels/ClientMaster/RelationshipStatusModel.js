import mongoose from "mongoose";

const RelationshipStatusSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    }
})

const RelationshipStatusModel = new mongoose.model("RelationshipStatus",RelationshipStatusSchema);
export default RelationshipStatusModel;