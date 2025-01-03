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


