import IndustryMasterModel from "../../models/Configuration/IndustryModel.js";
import SolutionModel from "../../models/Configuration/SolutionModel.js";
import SubIndustryModel from "../../models/Configuration/SubIndustryModel.js";
import SubSolutionModel from "../../models/Configuration/SubSolutionModel.js";
import TerritoryModel from "../../models/Configuration/TerritoryModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SalesStageModel from "../../models/StageModels/SalesStageModel.js";
import SalesSubStageModel from "../../models/StageModels/SalesSubStage.js";
class ConfigurationController{
    static getCount = catchAsyncError(async (req, res, next) => {
       
        const industryCount = await IndustryMasterModel.countDocuments({});
        const territoryCount = await TerritoryModel.countDocuments({});
        const subIndustryCount = await SubIndustryModel.countDocuments({});
        const solutionCount = await SolutionModel.countDocuments({});
        const subSolutionCount = await SubSolutionModel.countDocuments({});
        const salesStageCount = await SalesStageModel.countDocuments({});
        const salesSubStageCount = await SalesSubStageModel.countDocuments({});
         
        res.status(200).json({
            status: 'success',
            message: 'Config Counts fetched successfully',
            data: {
                industry : industryCount,
                "sub-industry" : subIndustryCount,
                solution : solutionCount,
                territory : territoryCount,
                "sub-solution" : subSolutionCount,
                "sales-stage" : salesStageCount,
                "sales-sub-stage" : salesSubStageCount,
            },
        });
    });
}

export default ConfigurationController