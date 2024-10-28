import mongoose from "mongoose";

const ArchetypeSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    }
})

const ArchetypeModel = new mongoose.model("Archetype",ArchetypeSchema);
export default ArchetypeModel;