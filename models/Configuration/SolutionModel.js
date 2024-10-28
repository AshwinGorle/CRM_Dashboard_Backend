import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
},
{
    timestamps: true
}
)

const SolutionModel = new mongoose.model("Solution",SolutionSchema);
export default SolutionModel;