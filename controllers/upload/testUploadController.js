import csv from "csvtojson";
import { sendBulkUploadResponse } from "../../utils/upload.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { Readable } from "stream";
import { parseRevenueData } from "../../utils/upload.utils.js";
import { generateRevenues } from "../../utils/opportunity.utils.js";
import { getFormattedData } from "../../utils/upload.utils.js";

class UploadController {
  
  static uploadClientInBulk = catchAsyncError(async (req, res) => {
    let { check } = req.query;
    check = check === "true" ? true : false;
    const stream = Readable.from(req.file.buffer.toString());
    const bulkData = await csv().fromStream(stream);
    // console.log("csv from steam : ", bulkData);
    const { formattedData, analysisResult } = await getFormattedData(
      bulkData,
      `client`
    );
    await sendBulkUploadResponse(res, check, bulkData, formattedData, analysisResult, 'client');
  });
  
  static uploadContactInBulk = catchAsyncError(async (req, res) => {
    // const csvFilePath = req.file.path;
    let { check } = req.query;
    check = check === "true" ? true : false;
    const stream = Readable.from(req.file.buffer.toString());
    const bulkData = await csv().fromStream(stream);
    const { formattedData, analysisResult } = await getFormattedData(
      bulkData,
      "contact"
    );
    console.log("analysis result ---", analysisResult);
    console.log("formatted data ---", formattedData);
    await sendBulkUploadResponse(res, check, bulkData, formattedData, analysisResult, 'contact');

  });

  static uploadOpportunityInBulk = catchAsyncError(async (req, res) => {
    let { check } = req.query;
    check = check == 'true' ? true : false;
    const stream = Readable.from(req.file.buffer.toString());
    const bulkData = await csv().fromStream(stream);
    const indexToRemove = 0;
    const updatedBulkData = bulkData
      .slice(0, indexToRemove)
      .concat(bulkData.slice(indexToRemove + 1)); // removing the second row from bulkdata
    console.log("updated bulk data ----", updatedBulkData);
    console.log("bulk data---", bulkData);
    const { formattedData, analysisResult } = await getFormattedData(
      updatedBulkData,
      "opportunity"
    );
    

    const revenueData = parseRevenueData(bulkData);
      const revenueIdData = await generateRevenues(revenueData);
      console.log(revenueData);
      console.log(revenueIdData);
      revenueIdData.forEach((revenueArray, idx) => {
        formattedData[idx]["revenue"] = revenueArray;
      });
    
    await sendBulkUploadResponse(res, check, bulkData, formattedData, analysisResult, 'opportunity');
    return;
  });

  static uploadTenderInBulk = catchAsyncError(async (req, res) => {
    
    let { check } = req.query;
    check = check === "true" ? true : false;
    const stream = Readable.from(req.file.buffer.toString());
    const bulkData = await csv().fromStream(stream);
    console.log("tender bulk data ", bulkData);
    const { formattedData, analysisResult } = await getFormattedData(
      bulkData,
      "tender"
    );
    console.log("analysis result ---", analysisResult);
    console.log("formatted data ---", formattedData);
    await sendBulkUploadResponse(res, check, bulkData, formattedData, analysisResult, 'tender');
    return
  });
  
  static uploadBDInBulk = catchAsyncError(async (req, res)=>{
    let { check } = req.query;
    check = check === "true" ? true : false;
    const stream = Readable.from(req.file.buffer.toString());
    const bulkData = await csv().fromStream(stream);
    console.log("BD bulk data ", bulkData);
    const { formattedData, analysisResult } = await getFormattedData(
      bulkData,
      "businessDevelopment"
    );
    console.log("analysis result for bd---", analysisResult);
    console.log("formatted data bd ---", formattedData);
    await sendBulkUploadResponse(res, check, bulkData, formattedData, analysisResult, 'businessDevelopment');
    return
  })

}

export default UploadController;
