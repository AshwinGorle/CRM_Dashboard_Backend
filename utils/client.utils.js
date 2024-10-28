import ClientMasterModel from "../models/ClientMasterModel.js"
import ClassificationModel from "../models/ConfigModels/ClientMaster/ClassificationModel.js";
import ContactMasterModel from "../models/ContactMasterModel.js";
import { ServerError } from "./customErrorHandler.utils.js";
import OpportunityMasterModel from "../models/OpportunityMasterModel.js";

function formatArrayString(input) {
    // Remove spaces after '[' and before ']'
    let formatted = input.replace(/\[\s*/, '[').replace(/\s*\]/, ']');

    // Remove spaces around single quotes
    formatted = formatted.replace(/\s*'([^']*)'\s*/g, "'$1'");

    return formatted;
}

export const getClientId = ()=>{
    return Array.from({ length: 6 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
} 

export const checkForLifetimeValueAndUpdate = async (clientId, session)=>{
    console.log("entered")
    const client = await ClientMasterModel.findById(clientId);
    if(!client)throw new ServerError("NotFound","client (while calculating lifeTimeValue)");
    const opportunities = await OpportunityMasterModel.find({client : clientId}).populate("revenue salesSubStage" ).session(session);
    console.log("lookup opp : ", opportunities)
    console.log("opportunities ", opportunities);
    let lifeTimeValue = 0;
    if(opportunities.length == 0 ) lifeTimeValue = 0;
    lifeTimeValue = opportunities.reduce((acc, opportunity)=>{
         console.log("Includes : ", opportunity?.salesSubStage?.label )
         if(opportunity?.salesSubStage?.label == "Won - 6"){
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

export const parseContacts = async (relatedContacts, client)=>{
    if(relatedContacts){
        
        console.log("relatedcn----", relatedContacts[0])
        // relatedContacts = JSON.parse(relatedContacts)
    }else { return }
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

export const getClient = async(clientId)=>{
    const client = await ClientMasterModel.findById(clientId);
    if(!client) throw new ServerError('NotFound',"client");
    return client;
}

export const getClassification = async(cId)=>{
    const classification = await ClassificationModel.findById(cId);
    if(!classification) throw new ServerError('NotFound',"classification");
    return classification;
}


