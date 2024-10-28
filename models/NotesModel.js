import mongoose from "mongoose";
const noteSchema = new mongoose.Schema({
    description : {
        type : String,
    }
})

const NoteModel = new mongoose.model("Note", noteSchema);
export default NoteModel;