import { Router } from "express";
import UploadController from '../../controllers/upload/testUploadController.js'
import upload from "../../utils/storage.utils.js";
import uploadStream from "../../utils/memoryStorage.utils.js";

const  uploadRouter = Router();

uploadRouter.post('/client', uploadStream.single('dataFile'), UploadController.uploadClientInBulk);
uploadRouter.post('/contact', uploadStream.single('dataFile'), UploadController.uploadContactInBulk);
uploadRouter.post('/opportunity', uploadStream.single('dataFile'), UploadController.uploadOpportunityInBulk);
uploadRouter.post('/tender', uploadStream.single('dataFile'), UploadController.uploadTenderInBulk);
uploadRouter.post('/bd', uploadStream.single('dataFile'), UploadController.uploadBDInBulk);

export default uploadRouter;