import { ClientError, ServerError } from "../../utils/customErrorHandler.utils.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SalesStageModel from "../../models/StageModels/SalesStageModel.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import {errors} from "../../utils/responseMessages.js"
import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
import StageHistoryController from "../History/stageHistoryController.js";

class SalesStageController {

    // Get salesStage Id by level
    static getSalesStageByLevel = async (level)=>{
          const stage = await SalesStageModel.find({level : level});
          console.log("stage ", stage)
          return stage
    } 

    // Create SalesStageMaster
    static createSalesStage = catchAsyncError(async (req, res, next) => {
        const { label, description, level } = req.body;
        const newSalesStageMaster = await SalesStageModel.create({ label, level, description });
        res.status(201).json({
            status: 'success',
            message: 'Sales Stage Master created successfully',
            data: newSalesStageMaster,
        });
    });
    
    // -1 means invalid stage change, 1 forward change, 0 backward change
    static checkForwardOrBackwardChange = async(currentStageId, newSalesStageId, allSalesStages)=>{
        const currentStage  =  allSalesStages.find((stage)=> stage._id.toString() == currentStageId);
        const newStage  =  allSalesStages.find((stage)=>stage._id.toString() == newSalesStageId);
        if(Math.abs(currentStage.level - newStage.level) > 1 ) return -1;
        if(currentStage.level < newStage.level) return 1;
        else return 0;
    }

    // Handle Forward changes
    static handleForwardStageChange = async(newSalesStageId, opportunity, allSalesStages, updateDate , session)=>{
         const currentOppHistory = opportunity.stageHistory.sort((a, b)=> a.stage.level - b.stage.level); // sorted
         const n = currentOppHistory.length;
         const lastHistory = currentOppHistory[n-1];
         
         //update date must be greater than or equal to last history entry date
         if(updateDate < lastHistory.entryDate) throw new ClientError("handleForwardStageChange", errors.stage.INVALID_UPDATE_DATE);

         //Inserting exit date in current last history
         console.log("last history : ", lastHistory)
         await StageHistoryModel.findByIdAndUpdate(lastHistory._id, {exitDate : updateDate}, {session : session});
         //Creating & Inserting entry date in new history
         const newStageHistoryId = await  StageHistoryController.createHistory(newSalesStageId, opportunity._id, updateDate, session);

         //inserting the new stage history in Opp and updating it's current salesStage
         opportunity.salesStage = newSalesStageId
         opportunity.stageHistory.push(newStageHistoryId);
         await opportunity.save({session});
         console.log("History Change successful (forward)");
         return
    }
    // Handle Backward changes4
    static handleBackwardStageChange = async(newSalesStageId, opportunity, allSalesStages, updateDate , session)=>{
        console.log("handleBackwardStageChange")
        const currentOppHistory = opportunity.stageHistory.sort((a, b)=> a.stage.level - b.stage.level); // sorted
        const n = currentOppHistory.length;
        const secondLastHistory = currentOppHistory[n-2];
        const lastHistory = currentOppHistory[n-1];
        
        // removing the last stage data
        opportunity.stageHistory = opportunity.stageHistory.filter((history)=>history._id.toString() != lastHistory._id.toString() );
        await StageHistoryModel.findByIdAndDelete(lastHistory._id, {session});

        // removing exit date from second last stage
        await StageHistoryModel.findByIdAndUpdate(secondLastHistory._id, {exitDate : null}, {session});

        await opportunity.save({session})
        console.log("History Change successful (Backward)");

    }
    // Handel History change 
    static handleStageChange = async ( newSalesStageId, opportunityId, updateDate, session)=>{
        // checking the new stage provided is valid or not
        const allSalesStages = await SalesStageModel.find({});
        if(!allSalesStages.find(stage=>stage._id.toString() == newSalesStageId)) throw new ClientError ("handleStageChange",errors.stage.INVALID_STAGE)

        const opportunity = await OpportunityMasterModel.findById(opportunityId).populate("stageHistory stageHistory.stage");
        const currentStageId = opportunity.salesStage.toString();
        if(currentStageId == newSalesStageId){
            console.log("No Stage Change required ! (new and curr stage is same)")
            return;
        }
        const isValidStageChange = await this.checkForwardOrBackwardChange(currentStageId, newSalesStageId, allSalesStages);
        if(isValidStageChange == -1) throw new ClientError("handleStageChange",errors.stage.INVALID_STAGE_CHANGE);

        //Handling change accordingly
        if(isValidStageChange == 1){
           await this.handleForwardStageChange(newSalesStageId, opportunity, allSalesStages, updateDate, session);
        }else{
           await this. handleBackwardStageChange(newSalesStageId, opportunity, allSalesStages,updateDate, session);
        }        
    }

    // Check is it valid change (1 step ahead or 1 step back);

    // Get all SalesStageMasters
    static getAllSalesStage = catchAsyncError(async (req, res, next) => {
        const salesStageMasters = await SalesStageModel.find();
        res.status(200).json({
            status: 'success',
            message: 'All Sales Stage Masters retrieved successfully',
            data: salesStageMasters,
        });
    });

    // Get SalesStageMaster by ID
    static getSalesStageById = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const salesStageMaster = await SalesStageModel.findById(id);
        if (!salesStageMaster) throw new ServerError("NotFound", "Sales Stage Master");
        res.status(200).json({
            status: 'success',
            message: 'Sales Stage Master retrieved successfully',
            data: salesStageMaster,
        });
    });

    // Update SalesStageMaster
    static updateSalesStage = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
        const { label, description } = req.body;
        const salesStageMaster = await SalesStageModel.findById(id);
    
        if (!salesStageMaster) throw new ServerError("NotFound", "Sales Stage Master");
    
        salesStageMaster.label = label;
        salesStageMaster.description = description;
        const updatedSalesStageMaster = await salesStageMaster.save();
    
        res.status(200).json({
            status: 'success',
            message: 'Sales Stage Master updated successfully',
            data: updatedSalesStageMaster,
        });
    });

    // Delete SalesStageMaster
    static deleteSalesStage = catchAsyncError(async (req, res, next) => {
        const { id } = req.params;
    
        const salesStageMaster = await SalesStageModel.findByIdAndDelete(id);
    
        res.status(200).json({
            status: 'success',
            message: 'Sales Stage Master deleted successfully',
            data: salesStageMaster,
        });
    });
}

export default SalesStageController;