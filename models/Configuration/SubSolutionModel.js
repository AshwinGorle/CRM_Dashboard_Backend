import mongoose from "mongoose";

const SubSolutionSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
    description : {
        type : String
    }
},    {
    timestamps: true
})

const SubSolutionModel = new mongoose.model("SubSolution",SubSolutionSchema);
export default SubSolutionModel;