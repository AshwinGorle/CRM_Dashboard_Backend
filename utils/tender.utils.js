import TenderStageModel from "../models/ConfigModels/TenderMaster/TenderStageModel.js"
import { ServerError } from "./customErrorHandler.utils.js";
import ClientMasterModel from "../models/ClientMasterModel.js";
export const checkForSubmissionDate = async (stageId) => {
   console.log("updating submission date");
   const tenderStage = await TenderStageModel.findById(stageId);
   if (!tenderStage) throw new ServerError("NotFound", "tender stage")
   if(tenderStage.label == "Tender Submitted"){
      return Date.now();
   }else{
    return null
   }
}

export const generateTenderId = (territoryName, clientName, date) => {
    const territoryPart = territoryName
      .toUpperCase()
      .replace(/\s+/g, "")
      .slice(0, 4);
    const clientPart = clientName.toUpperCase().replace(/\s+/g, "").slice(0, 3);
    const monthAbbreviations = [
      "JA",
      "FE",
      "MR",
      "AP",
      "MA",
      "JN",
      "JL",
      "AU",
      "SE",
      "OC",
      "NO",
      "DE",
    ];
    const monthPart = monthAbbreviations[new Date(date).getMonth()];
    const numberPart = Math.floor(Math.random() * 90 + 10).toString();
    const customID = `TN-${territoryPart}-${clientPart}-${monthPart}-${numberPart}`;
    return customID;
  };

export const checkForTenderId = async (clientId, tender) => {
    const clientDetails = await ClientMasterModel.findById(clientId)
        .select("name territory")
        .populate("territory");
    if(!clientDetails) throw new ServerError("NotFound", "client (while calculating tenderId)")
      const territory = clientDetails?.territory?.label;
      if (territory) {
        const tenderId = generateTenderId(
          territory,
          clientDetails.name,
          new Date()
        );
        console.log("Territory Id ", tenderId);
        return tenderId;
      }else{
        return null;
      }
}