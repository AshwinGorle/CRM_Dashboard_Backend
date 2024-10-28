// import mongoose from "mongoose";

import mongoose from "mongoose";

// const TeamMasterSchema = new mongoose.Schema({
//     firstName : {
//         type : String,
//         required : true,
//     },
//     lastName : {
//         type : String,
//         required : true,
//     },
//     role : {
//         type : String,
//     },
//     phone : {
//         type : Number,
//         // required : true
//     },
//     email : {
//         type : String,
//         // require : true
//     },
//     DOB : {
//         type : Date
//     },
//     Address : {
//         type : String
//     },
//     gender : {
//         type : String,
//         enum : ["M", "F", "O"],
//         // required : true
//     },
//     password :  {
//         type : String
//     },
//     avatar: {
//         type : String ,
//         default : "https://th.bing.com/th/id/OIP.XA5z4qJxvb0XtfkwB0DLxAAAAA?rs=1&pid=ImgDetMain"
//     },
// })

// const TeamMasterModel = new mongoose.model("TeamMaster",TeamMasterSchema);
// export default TeamMasterModel;

const TeamSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    }
})

const TeamModel =  new mongoose.model("Team", TeamSchema);
export default TeamModel;