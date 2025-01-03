import SystemModel from "../../models/SystemModel.js";

export const fetchWonStage = async () => {
  const systemConfig = await SystemModel.findOne({});
  if (!systemConfig || !systemConfig.wonSalesStage)
    throw new ClientError("NOT_FOUND", "Please Set System config first");
  return systemConfig.wonSalesStage;
};

export const fetchSubmittedTenderStage = async () => {
  const systemConfig = await SystemModel.findOne({});
  if (!systemConfig || !systemConfig.submittedTenderStage)
    throw new ClientError("NOT_FOUND", "Please Set System config first");
  return systemConfig.submittedTenderStage
};

