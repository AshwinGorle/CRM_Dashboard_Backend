import mongoose from "mongoose";

const connectDb  = async(DATABASE_URL)=>{
   const dbOptions = {
    dbName : "CRMSystem"
   }
   try{
     await mongoose.connect(DATABASE_URL, dbOptions)
     console.log("database connected...");
   }catch(err){
     console.log("db connection error : ",err);
   }
}

export default connectDb;