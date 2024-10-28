import mongoose from "mongoose";

const RegistrationStatusSchema = new mongoose.Schema({
    label : {
        type : String,
        require : true
    },
})

const RegistrationStatusModel = new mongoose.model("RegistrationStatus",RegistrationStatusSchema);
export default RegistrationStatusModel;