import ClientMasterModel from "../../models/ClientMasterModel.js";
import ContactMasterModel from "../../models/ContactMasterModel.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";

const generateCustomId = (clientName, clientTerritory, type) => {
  console.log('client in generateCustomID : ', clientName, clientTerritory, type)
  if (!type) throw new Error("Id type is required to generate custom id");
  // 1. Ensure client has a territory
  if (!clientTerritory || !clientTerritory.label) {
    throw new Error("Client does not have a valid territory label.");
  }
  // 2. Extract Territory label (assuming `territory` is a reference to the Territory model)
  let territoryLabel = clientTerritory.label;
  // Pad territory label to make it 4 characters if it's less than 4
  const territoryCode = territoryLabel
    .slice(0, 4)
    .toUpperCase()
    .padStart(4, "0"); // First 4 chars, padded with '0'
  // 3. Ensure client has a name
  if (!clientName || clientName.trim() === "") {
    throw new Error("Client does not have a valid name.");
  }
  // 4. Extract Client Name (taking the first 3 characters of the client's name)
  
  // Pad client name to make it 3 characters if it's less than 3
  const clientCode = clientName.slice(0, 3).toUpperCase().padStart(3, "0"); // First 3 chars, padded with '0'
  // 5. Get the current month (2 digits)
  const currentMonth = new Date().toLocaleString("en-US", { month: "2-digit" });
  // 6. Generating Two random digits in string formate
  const twoDigitRandomNumber = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  // 7. Generate the Tender ID in the required format

  let prefix = "";
  if (type == "tender") prefix = "TN";
  else prefix = "OP";
  const customId = `${prefix}-${territoryCode}-${clientCode}-${currentMonth}-${twoDigitRandomNumber}`;
  return customId;
};

export const getTenderId = (clientName, clientTerritory)=>{
    return generateCustomId(clientName, clientTerritory, "tender");
}

export const getOpportunityId = (clientName, clientTerritory)=>{
    return generateCustomId(clientName, clientTerritory, "opportunity");
}


// handle addition and deletion contact from client when we receive an array of contact ids 
export const parseContacts = async (relatedContacts, client)=>{
    if(!relatedContacts) return // if
    console.log("related contacts in parseContacts----", relatedContacts)
    if(Array.isArray(relatedContacts) && relatedContacts.length > 0){
        for (const contactId of relatedContacts){
            const contact = await ContactMasterModel.findById(contactId);
            if(!contact) throw new ServerError("NotFound","contact")
            if(contact && client.relatedContacts.filter((contact)=>contact.toString() == contactId.toString()).length === 0){
                contact.client = client._id
                await contact.save();
                client["relatedContacts"].push(contact._id)
            }

        }
    }
}


//used in create and update opportunity, Whenever the opportunity's expectedRevenue updates the client lifeTime value is re-calculated
export const updateLifeTimeValueOfClient = async (clientId, session)=>{
  console.log("updating lifetime value of client")
  const wonSubStageId = "670e81150a2c8e8563f16b55"
  const client = await ClientMasterModel.findById(clientId);
  if(!client)throw new ServerError("NotFound","client (while calculating lifeTimeValue)");
  const opportunities = await OpportunityMasterModel.find({client : clientId}).populate("revenue salesSubStage" ).session(session);
  let lifeTimeValue = 0;
  console.log("opp length : ", opportunities.length)
  if(opportunities.length == 0 ){ 
    lifeTimeValue = 0
  }
  else lifeTimeValue = opportunities.reduce((acc, opportunity)=>{
       console.log("Includes : ", opportunity?.salesSubStage?.label )
       if(opportunity?.salesSubStage?._id.toString() == wonSubStageId){
           return acc + opportunity?.revenue?.reduce(
               (accumulator, current) => {
                 return accumulator + current.Q1 + current.Q2 + current.Q3 + current.Q4;
               },
               0
             );
       }
       return acc + 0;
   }, 0);
   console.log("calculated lifetime value", lifeTimeValue)
   client.lifeTimeValue = lifeTimeValue;
   await client.save({session});
}

