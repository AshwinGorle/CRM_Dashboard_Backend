import ClientMasterModel from "../../models/ClientMasterModel.js";
import TenderMasterModel from "../../models/TenderMasterModel.js"
import { getTenderId } from "./clientService.js";

// when client name or territory updated we need to change the tender customId
export const handleUpdateTenderId = async (clientId, clientName, clientTerritory, session) => {
    const tenders = await TenderMasterModel.find({ client: clientId }).session(session);

    tenders.forEach(tender => {
        tender.customId = getTenderId(clientName, clientTerritory);
    });

    await Promise.all(
        tenders.map(tender => tender.save({ session }))
    );
};

//used in create and update Tender 
export const getTenderIdWithoutClient = async(client)=>{
    const fetchedClient = await ClientMasterModel.findById(client, 'name territory').populate('territory', 'label');
    if(!client) throw new ServerError("notFount", "Client not found ! while generating Op Id");
    const customId = getTenderId(fetchedClient.name, fetchedClient.territory);
    return customId;
}