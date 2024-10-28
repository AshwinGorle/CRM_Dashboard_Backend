import SalesSubStageModel from "../../models/StageModels/SalesSubStage.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { ClientError, ServerError } from "../../utils/customErrorHandler.utils.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { error } from "../../middlewares/error.middleware.js";
import { errors } from "../../utils/responseMessages.js";
import SalesStageModel from "../../models/StageModels/SalesStageModel.js";
import SubStageHistoryModel from "../../models/HistoryModels/SubSageHistoryModel.js";
import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
class SalesSubStageController {

    static handleSubStageChange = async (newSalesSubStageId, opportunityId, updateDate, session)=>{
        // Gathering required info
        const allSalesSubStages = await SalesSubStageModel.find({});
        const allSalesStages = await SalesStageModel.find({});
        
        // Validate provided subStageId 
        if(!allSalesSubStages.find(subStage=>subStage._id.toString() == newSalesSubStageId)) throw new ClientError ("handleSubStageChange",errors.subStage.INVALID_STAGE);
        const opportunity = await OpportunityMasterModel.findById(opportunityId).populate("stageHistory stageHistory.stage").session(session);
        
        // If Already in the given sub stage do nothing
        if(newSalesSubStageId == opportunity.salesSubStage.toString()){
            console.log("No sub stage change needed");
            return
        }

        // Validating subStage with the Stage
        const subStage = allSalesSubStages.find((subStage)=>subStage._id == newSalesSubStageId)
        if(subStage.salesStage.toString() != opportunity.salesStage.toString()) throw new ClientError("handleSubStageChange", errors.subStage.MISMATCHED_STAGE);
        
        //Creating new subStageHistory
        const newSubStageHistory = new SubStageHistoryModel({subStage : newSalesSubStageId, entryDate : updateDate});
        await newSubStageHistory.save({session});

        //Pushing this subStage history in corresponding stage history of opportunity
        const stageHistoryToUpdate = opportunity.stageHistory.find(stageHistory=>stageHistory.stage._id.toString() == subStage.salesStage.toString());
        if(!stageHistoryToUpdate) throw new ServerError("handleSubStageChange", "stage history not fount for the curresponding sub Stage History");
        await StageHistoryModel.findByIdAndUpdate(stageHistoryToUpdate._id, {$push : {subStageHistory : newSubStageHistory._id }}, {session : session});

        console.log("Sub stage update successful");

    }

    // Create SalesSubStageMaster
    static createSalesSubStage = catchAsyncError(async (req, res, next) => {
        const { label, salesStage, description, level } = req.body;
        const newSalesSubStageMaster = await SalesSubStageModel.create({ label, salesStage, description, level });
        res.status(201).json({
            status: 'success',
            message: 'Sales Sub-Stage Master created successfully',
            data: newSalesSubStageMaster,
        });
    });

    // Get all SalesSubStageMasters
    static getAllSalesSubStage = catchAsyncError(async (req, res, next) => {
        console.log("get all sub stage called")
        const salesSubStageMasters = await SalesSubStageModel.find().populate('salesStage');
        res.status(200).json({
            status: 'success',
            message: 'All Sales Sub-Stage Masters retrieved successfully',
            data: salesSubStageMasters,
        });
    });

    // Get SalesSubStageMaster by ID
    static getSalesSubStageById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const salesSubStageMaster = await SalesSubStageModel.findById(id).populate('salesStage');
        if (!salesSubStageMaster) throw new ServerError("NotFound", "Sales Sub-Stage Master");
        res.status(200).json({
            status: 'success',
            message: 'Sales Sub-Stage Master retrieved successfully',
            data: salesSubStageMaster,
        });
    });

    // Update SalesSubStageMaster
    static updateSalesSubStage = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { name, salesStage, description } = req.body;
        const salesSubStageMaster = await SalesSubStageModel.findById(id);
    
        if (!salesSubStageMaster) throw new ServerError("NotFound", "Sales Sub-Stage Master");
    
        salesSubStageMaster.name = name;
        salesSubStageMaster.salesStage = salesStage;
        salesSubStageMaster.description = description;
        const updatedSalesSubStageMaster = await salesSubStageMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Sales Sub-Stage Master updated successfully',
            data: updatedSalesSubStageMaster,
        });
    });

    // Delete SalesSubStageMaster
    static deleteSalesSubStage = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const salesSubStageMaster = await SalesSubStageModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Sales Sub-Stage Master deleted successfully',
            data: salesSubStageMaster
        });
    });
}

// export default SalesSubStageMasterControllere
export default SalesSubStageController;