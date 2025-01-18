import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},
{
    timestamps: true
}
)

const SolutionModel = new mongoose.model("Solution",SolutionSchema);
export default SolutionModel;