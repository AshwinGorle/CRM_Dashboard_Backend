import mongoose from "mongoose";

const RevenueMasterSchema = new mongoose.Schema({
    year : {
        type : Number,
        required : true
    },
    // opportunity : {
    //    type : mongoose.Schema.Types.ObjectId,
    //    ref : 'OpportunityMaster',
    //    required : true
    // },
    total:{
        type : Number,
        default : 0,
        
    },
    Q1 : {
        type : Number,
        default : 0,
        // required : true
    }, 
    Q2 : {
        type : Number,
        default : 0,

        // required : true
    }, 
    Q3 : {
        type : Number,
        default : 0,

        // required : true
    }, 
    Q4 : {
        type : Number,
        default : 0,
        // required : true
    }, 
})

const RevenueMasterModel = new mongoose.model("RevenueMaster",RevenueMasterSchema);
export default RevenueMasterModel;