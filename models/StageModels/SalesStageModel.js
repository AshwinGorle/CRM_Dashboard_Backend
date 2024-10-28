import mongoose from "mongoose";

const SalesStageSchema = new mongoose.Schema({
  label: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  level: { 
    type: Number 
  },
});

const SalesStageModel = new mongoose.model(
  "SalesStage",
  SalesStageSchema
);
export default SalesStageModel;
