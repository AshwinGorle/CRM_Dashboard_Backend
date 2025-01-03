import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { getOpportunityId } from "./clientService.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";

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