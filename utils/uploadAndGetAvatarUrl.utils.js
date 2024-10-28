import path from 'path'
import fs from 'fs'
import uploadToCloudinary from './uploadToCloudinary.js';
import uploadStreamToCloudinary from './uploadStreamToCloudinary.js';
const getFileExtension = (fileName)=>{
   return fileName.split(".").pop();
}

const uploadAndGetAvatarUrl = async (file, resource, resourceId, type) => {
    if(type === 'stream'){
        const avatarUrl = await uploadStreamToCloudinary(file,`CRM/profile/${resource}`, resourceId, 2);
        return avatarUrl
    }else{
    const avatarUrl = await uploadToCloudinary(path, `CRM/Profile/${resource}`,resourceId,2);
    fs.unlinkSync(path);
    return avatarUrl;
    }
};


export default uploadAndGetAvatarUrl;