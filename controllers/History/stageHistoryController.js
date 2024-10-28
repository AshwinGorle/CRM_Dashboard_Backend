import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
import SalesStageController from "../Stage/salesStageController.js";
class StageHistoryController{
    static createHistory = async ( salesStageId, opportunityId, entryDate, session)=>{
        if(!entryDate) entryDate = Date.now();
        const stageHistory =  new StageHistoryModel({
            stage: salesStageId,
            entryDate,
            opportunity : opportunityId
        });
        await stageHistory.save({session});
        console.log("New History : ", stageHistory);
        return stageHistory._id;
    }
    static createInitialHistory = async (opportunityId, entryDate, session)=>{
        console.log("Entry Date in createInitialHistory : ", entryDate)
        const salesStage = await SalesStageController.getSalesStageByLevel(0);
        console.log("sales stage : ", salesStage);
        const stageHistory =  new StageHistoryModel({
            stage: salesStage[0]._id.toString(),
            entryDate,
            opportunity : opportunityId
        });
        await stageHistory.save({session});
        console.log("initial History : ", stageHistory);
        return stageHistory._id;
    }
}

export default StageHistoryController