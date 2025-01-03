import mongoose from "mongoose";
import { clientError } from "../../config/responseMessage.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import ClientMasterModel from  "../../models/ClientMasterModel.js"
import { getClient } from "../../utils/client.utils.js";
import { ServerError } from "../../utils/customErrorHandler.utils.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js" 
import ContactMasterModel from "../../models/ContactMasterModel.js";
import uploadAndGetAvatarUrl from "../../utils/uploadAndGetAvatarUrl.utils.js";
import { getClientId } from "../../utils/client.utils.js";
import { getFilterOptions, getSortingOptions } from "../../utils/searchOptions.js";
import { parseContacts } from "../../service/client/clientService.js";
import { handleUpdateOpportunityId } from "../../service/client/opportunityService.js";
import { handleUpdateTenderId } from "../../service/client/tenderService.js";
import TerritoryModel from "../../models/Configuration/TerritoryModel.js";

class ClientMasterController {

    static createClient = catchAsyncError(async (req, res) => {
        let {
            name,
            entryDate,
            enteredBy = req?.user?._id,
            industry,
            subIndustry,
            offering,
            territory,
            PursuedOpportunityValue,
            incorporationType,
            listedCompany,
            marketCap,
            annualRevenue,
            classification,
            totalEmployeeStrength,
            itEmployeeStrength,
            primaryRelationShip,
            secondaryRelationship,
            relatedContacts,
            relationshipStatus,
            lifeTimeValue,
            priority,
            detailsConfirmation,
            createdAt
        } = req.body;
        
    
        // Validate required fields
        if (
            !name ||
            !industry ||
            !subIndustry ||
            !territory ||
            !incorporationType ||
            !annualRevenue
        ) {
            return res.status(400).json({ status: 'failed', message: 'All required fields must be filled' });
        }
    
        // Manual validation for entryDate
        entryDate = new Date(entryDate);
        if (isNaN(entryDate.getTime())) {
            return res.status(400).json({ status: 'failed', message: 'Invalid entryDate' });
        }
    
        // Create a new instance of the ClientMasterModel
        let newClient = new ClientMasterModel({
            clientCode: getClientId(),
            name,
            entryDate,
            enteredBy,
            industry,
            subIndustry,
            offering,
            territory,
            PursuedOpportunityValue,
            incorporationType,
            listedCompany,
            marketCap,
            annualRevenue,
            classification,
            totalEmployeeStrength,
            itEmployeeStrength,
            primaryRelationShip,
            secondaryRelationship,
            relatedContacts: [],
            relationshipStatus,
            lifeTimeValue,
            priority,
            detailsConfirmation,
            createdAt
        });
        
        // Ensure relatedContacts is an array and not empty
        await parseContacts(relatedContacts, newClient);
         
        // handles avatar changes in client 
        if (req.file) {
            const avatarUrl = await uploadAndGetAvatarUrl(req.file, 'client', newClient._id, "stream");
            newClient.avatar = avatarUrl;
        }

        // Save the instance after all modifications are done
        await newClient.save();
        console.log("New client:", newClient);
    
        res.status(201).json({ status: 'success', message: "Client created successfully", data: newClient });
    });
    
 
  static getAllClient = catchAsyncError(async (req, res, next, session) => {
    console.log("get all clients req")
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const skip = (page-1)*limit;
    const {config} = req.query;
    const filterOptions = getFilterOptions(req.query);
    const sortingOptions = getSortingOptions(req.query);
    console.log("filter" , filterOptions)
    console.log("sorting" , sortingOptions) 
    if(config === 'true'){
        const clients = await ClientMasterModel.find().select("name")
        return res.send({config : true , clients});
    }
    
    const totalCount = await ClientMasterModel.countDocuments(filterOptions);
    const clientMasters = await ClientMasterModel.find(filterOptions).sort(sortingOptions).skip(skip).limit(limit)
        .populate("enteredBy")
        .populate("industry")
        .populate("subIndustry")
        .populate("territory")
        .populate("incorporationType")
        .populate("classification")
        .populate("primaryRelationship")
        .populate("secondaryRelationship")
        .populate("relationshipStatus")
        .populate("relatedContacts")
        .session(session);

    res.status(200).json({
        status: 'success',
        message: 'All Client Masters retrieved successfully',
        data: {page, limit, totalCount, clients : clientMasters},
    });

  });

static getClientById = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const client = await ClientMasterModel.findById(id)
        .populate("enteredBy")
        .populate("industry")
        .populate("subIndustry")
        .populate("territory")   
        .populate("incorporationType")
        .populate("classification")
        // .populate("primaryRelationship")
        // .populate("secondaryRelationship")
        .populate("relationshipStatus")
        // .populate("relatedContacts");

    res.status(200).json({
        status: 'success',
        message: 'Client retrieved successfully',
        data: client,
    });
});

static updateClient = catchAsyncError(async (req, res, next, session) => {
    const { id } = req.params;
    const updateData = req.body;
    console.log("update client req : ", updateData)
    const client = await ClientMasterModel.findById(id).populate('territory');

    if (!client) throw new ServerError("NotFound", "Client");
    
    // Updating directly updatable fields
    Object.keys(updateData).forEach((key) => {
        if(key!='relatedContacts')
          client[key] = updateData[key];
    });
    
    // Parsing Related contacts 
    if(updateData.relatedContacts) await parseContacts(updateData.relatedContacts, client);

    // Handle Client Avatar change
    if(req.file){
        client.avatar =  await uploadAndGetAvatarUrl(req.file,'client',client._id, "stream" );
    }
    
    const updatedClientMaster = await client.save({session});
    // on change of ( territory || name ) we have to update tenders and opportunities custom id associated with this client
    if(updateData.territory || updateData.name){
        if(updateData.territory) client.territory = await TerritoryModel.findById(client.territory);
        await handleUpdateOpportunityId(client._id, client.name, client.territory,  session);
        await handleUpdateTenderId(client._id, client.name, client.territory, session);
    }
    
    res.status(200).json({
        status: 'success',
        message: 'Client updated successfully',
        data: updatedClientMaster,
    });
}, true);

static deleteClient = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const client = await ClientMasterModel.findByIdAndDelete(id);

    res.status(200).json({
        status: 'success',
        message: 'Client deleted successfully',
        data: client
    });
});

}
export default ClientMasterController;
