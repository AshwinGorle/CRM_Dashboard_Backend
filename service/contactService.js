


import ClientMasterModel from "../models/ClientMasterModel.js"
import ContactMasterModel from "../models/ContactMasterModel.js"


//Description : When contact's client is changed we have to do 1) remove the contact from previous client, 2) add the contact in new client, 3) update the new client in contact 
//Handling client change in contact
export const handleClientChange = async ({ contactId, clientId, session }) => {
        console.log("handleClientChange ",contactId,clientId)
        // Fetch the contact with its current client
        const contact = await ContactMasterModel.findById(contactId).session(session);
        if (!contact) throw new Error("Contact not found");

        const previousClientId = contact.client; // The current client associated with the contact
        // Fetch the new client
        const newClient = await ClientMasterModel.findById(clientId).session(session).select('relatedContacts');
        if (!newClient) throw new Error("New client not found");

        // Step 1: Remove contact from the previous client
        if (previousClientId) {
            await ClientMasterModel.findByIdAndUpdate(
                previousClientId,
                { $pull: { relatedContacts: contactId } },
                { session }
            );
        }

        // Step 2: Add contact to the new client if not already there
        if (!newClient.relatedContacts?.includes(contactId)) {
            await ClientMasterModel.findByIdAndUpdate(
                clientId,
                { $addToSet: { relatedContacts: contactId } },
                { session }
            );
        }

        // Step 3: Update the contact’s client field
        await ContactMasterModel.findByIdAndUpdate(
            contactId,
            { client: clientId },
            { session }
        );

};
