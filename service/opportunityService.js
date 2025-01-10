import OpportunityMasterModel from "../models/OpportunityMasterModel.js";
import { getOpportunityId } from "./clientService.js";
import ClientMasterModel from "../models/ClientMasterModel.js";
import { ClientError, ServerError } from "../utils/customErrorHandler.utils.js";
import TenderMasterModel from "../models/TenderMasterModel.js";
import { getTender } from "./tenderService.js";


//to get populated opportunity 
export const getOpportunity = async (opportunityId, onNotFound="Opp. not found", session)=>{
     const opportunity = await OpportunityMasterModel.findById(opportunityId)
     .populate("enteredBy")
     .populate("associatedTender")
     .populate("solution")
     .populate("subSolution")
     .populate("salesChamp")
     .populate("salesStage")
     .populate("salesSubStage")
     .populate("revenue")
     .populate("client")
     .session(session)
     if(!opportunity) throw new ServerError("notFount", `${onNotFound}`);
     return opportunity
}

// used in update client
// when client name or territory updated we need to change the opportunity customId here clientTerritory is object
export const handleUpdateOpportunityId = async (clientId, clientName, clientTerritory, session) => {
    const opportunities = await OpportunityMasterModel.find({ client: clientId }).session(session);
    opportunities.forEach(opportunity => {
        opportunity.customId = getOpportunityId(clientName, clientTerritory);
    });
    await Promise.all(
        opportunities.map(opportunity => opportunity.save({ session }))
    );
};


//used in create and update opportunity opportunity
export const getOpportunityIdWithoutClient = async(client)=>{
       const fetchedClient = await ClientMasterModel.findById(client, 'name territory').populate('territory', 'label');
       if(!client) throw new ServerError("notFount", "Client not found ! while generating Op Id");
       const customId = getOpportunityId(fetchedClient.name, fetchedClient.territory);
       return customId;
}

//opportunity is object with populated revenue field 
// when we create or update an opportunity revenue for different years we have to calculate totalRevenue (sum of revenues of all years) expectedSales (totalRevenue * confidenceLevel)
export const updateTotalRevenueAndExpectedSales = (opportunity)=>{
    if(!opportunity) throw new ServerError("NotFound", "Opportunity inside updateRandS");
    const totalRevenue = opportunity?.revenue?.reduce(
        (accumulator, current) => {
          return accumulator + current.Q1 + current.Q2 + current.Q3 + current.Q4;
        },
        0
      );
    const confidenceLevel = opportunity?.confidenceLevel || 100
    const expectedSales =  totalRevenue * (confidenceLevel / 100)
    opportunity.totalRevenue = totalRevenue;
    opportunity.expectedSales = expectedSales;
}

// use to add associated tender in opportunity while creating and updating tender
//confirmation is to override the tender of the opportunity with current tender
export const updateAssociatedTenderInOpportunity = async (opportunityId, tenderId, session, confirmation = true) =>{
   if(!opportunityId || ! tenderId) throw new ServerError("NotFound", "opportunityId and tenderId needed to update tender in opportunity");
   const tender = await getTender(tenderId, `invalid tenderId for updateAssociatedTenderInOpportunity`,session)
   let opportunity = await getOpportunity(opportunityId, `invalid oppId : ${opportunityId} in updateAssociatedTenderInOpportunity`, session)
   if(!confirmation && opportunity.associatedTender)  throw new ServerError("NotFound",`Do you want to overwrite tender:${tender.customId} in the opportunity: ${opportunity.customId}`)
   opportunity.associatedTender = tenderId;
   opportunity.save({session});
   opportunity = await getOpportunity(opportunityId, `invalid oppId : ${opportunityId} in updateAssociatedTenderInOpportunity After updating opp.`, session)
   return opportunity
}