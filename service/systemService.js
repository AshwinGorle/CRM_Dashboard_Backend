import SystemModel from "../models/SystemModel.js";
import { ClientError } from "../utils/customErrorHandler.utils.js";

// it returns won stage Id  in object id form
export const fetchWonStage = async () => {
  const systemConfig = await SystemModel.findOne({});
  if (!systemConfig || !systemConfig.wonStage)
    throw new ClientError("NOT_FOUND", "Please Set System config first");
  return systemConfig.wonStage;
};


// it returns tender submitted stage id in object id form
export const fetchSubmittedTenderStage = async () => {
  const systemConfig = await SystemModel.findOne({});
  if (!systemConfig || !systemConfig.tenderSubmittedStage)
    throw new ClientError("NOT_FOUND", "Please Set System config first");
  return systemConfig.tenderSubmittedStage
};

 