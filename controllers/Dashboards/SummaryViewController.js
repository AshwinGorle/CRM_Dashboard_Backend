import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import mongoose from "mongoose";
import SalesStageModel from "../../models/StageModels/SalesStageModel.js";
import applyFilters from "../../utils/applyFilters.js";
import FunnelViewController from "./FunnelViewController.js";
import PipeViewController from "./PipeViewController.js";
import { ClientError } from "../../utils/customErrorHandler.utils.js";
import { errors } from "../../utils/responseMessages.js";
import { getFilterOptions } from "../../utils/searchOptions.js";
class SummaryViewController{

   
    static async getExpectedRevenue(startDate, endDate) {
        try {
            const result = await OpportunityMasterModel.aggregate([
                // Match opportunities with an expectedWonDate within the specified range
                {
                    $match: {
                        expectedWonDate: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        }
                    }
                },
                // Group to calculate total expected revenue and collect opportunity IDs
                {
                    $group: {
                        _id: null,
                        totalExpectedRevenue: { $sum: "$expectedSales" },
                        contributingOpportunities: { $push: "$_id" }
                    }
                },
                // Project the final result, removing the `_id` field
                {
                    $project: {
                        _id: 0,
                        totalExpectedRevenue: 1,
                        contributingOpportunities: 1
                    }
                }
            ]);
    
            // Return the total expected revenue and contributing opportunities array
            return result.length > 0
                ? {
                    value: result[0].totalExpectedRevenue,
                    contributingOpportunities: result[0].contributingOpportunities
                }
                : {
                    value: 0,
                    contributingOpportunities: []
                };
        } catch (error) {
            console.error("Error calculating expected revenue:", error);
            throw new Error("Failed to calculate expected revenue.");
        }
    }
    
    static async getActualRevenue(startDate, endDate) {
        try {
          // Convert provided string IDs to ObjectId for MongoDB compatibility
          const closingStageId = new mongoose.Types.ObjectId('670e7df5f5e783c1a47cd499');
          const wonSubStageId = new mongoose.Types.ObjectId('670e81150a2c8e8563f16b55');
    
          // Step 1: Find StageHistory documents with the closing stage within the given date range
          const wonOpportunities = await StageHistoryModel.aggregate([
            {
              $match: {
                stage: closingStageId,
                entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
              }
            },
            // Step 2: Populate subStageHistory and filter those containing the "won" sub-stage within the date range
            {
              $lookup: {
                from: 'substagehistories', // Assuming the collection name is 'substagehistories'
                localField: 'subStageHistory',
                foreignField: '_id',
                as: 'subStageHistoryDetails'
              }
            },
            {
              $match: {
                'subStageHistoryDetails.subStage': wonSubStageId,
                'subStageHistoryDetails.entryDate': { $gte: new Date(startDate), $lte: new Date(endDate) }
              }
            },
            // Collect opportunity IDs for these "won" opportunities
            {
              $group: {
                _id: null,
                wonOpportunityIds: { $addToSet: "$opportunity" }
              }
            },
            {
              $project: {
                _id: 0,
                wonOpportunityIds: 1
              }
            }
          ]);
    
          // If no opportunities were won in the period, return 0 for actual revenue and an empty array
          if (!wonOpportunities.length || !wonOpportunities[0].wonOpportunityIds.length) {
            return { actualRevenue: 0, contributingOpportunities: [] };
          }
    
          // Step 3: Calculate the total expectedSales for these "won" opportunities
          const actualRevenueResult = await OpportunityMasterModel.aggregate([
            {
              $match: {
                _id: { $in: wonOpportunities[0].wonOpportunityIds }
              }
            },
            {
              $group: {
                _id: null,
                totalActualRevenue: { $sum: "$expectedSales" },
                contributingOpportunities: { $push: "$_id" }
              }
            },
            {
              $project: {
                _id: 0,
                totalActualRevenue: 1,
                contributingOpportunities: 1
              }
            }
          ]);
    
          return {
            value: actualRevenueResult.length > 0 ? actualRevenueResult[0].totalActualRevenue : 0,
            contributingOpportunities: actualRevenueResult.length > 0 ? actualRevenueResult[0].contributingOpportunities : []
          };
        } catch (error) {
          console.error("Error calculating actual revenue:", error);
          throw new Error("Failed to calculate actual revenue.");
        }
    }

    static async getOpenOpportunities(startDate, endDate) {
        try {
          const openOpportunities = await OpportunityMasterModel.aggregate([
            // Match opportunities open within the given date range
            {
              $match: {
                openingDate: { $lte: new Date(endDate) },
                $or: [
                  { closingDate: { $gte: new Date(startDate) } },
                  { closingDate: null }
                ]
              }
            },
            // Get the count and IDs of open opportunities
            {
              $group: {
                _id: null,
                value: { $sum: 1 },
                contributingOpportunities: { $push: '$_id' }
              }
            },
            {
              $project: {
                _id: 0,
                value: 1,
                contributingOpportunities: 1
              }
            }
          ]);
    
          // Return the count and IDs of open opportunities or default values
          return openOpportunities.length > 0
            ? openOpportunities[0]
            : { value: 0, contributingOpportunities: [] };
        } catch (error) {
          console.error('Error calculating open opportunities:', error);
          throw new Error('Failed to calculate open opportunities.');
        }
    }

    static async getOpportunityWonCount(startDate, endDate) {
        try {
          // Define the ObjectId for the closing stage and won sub-stage
          const closingStageId = new mongoose.Types.ObjectId("670e7df5f5e783c1a47cd499");
          const wonSubStageId =  new mongoose.Types.ObjectId("670e81150a2c8e8563f16b55");
    
          const wonOpportunities = await StageHistoryModel.aggregate([
            // First, match all stage history entries for the "closing" stage within the date range
            {
              $match: {
                stage: closingStageId,
                entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
              }
            },
            // Populate the sub-stage history to check if the opportunity has the "won" sub-stage
            {
              $lookup: {
                from: "substagehistories",  // Collection for SubStageHistory
                localField: "subStageHistory",
                foreignField: "_id",
                as: "subStageHistoryDetails"
              }
            },
            // Filter sub-stages to retain only those with the "won" sub-stage within the date range
            {
              $match: {
                "subStageHistoryDetails.subStage": wonSubStageId,
                "subStageHistoryDetails.entryDate": {
                  $gte: new Date(startDate),
                  $lte: new Date(endDate)
                }
              }
            },
            // Extract unique opportunity IDs from the matching stage history documents
            {
              $group: {
                _id: null,
                contributingOpportunities: { $addToSet: "$opportunity" }
              }
            },
            // Project the count of won opportunities and the list of opportunity IDs
            {
              $project: {
                _id: 0,
                value: { $size: "$contributingOpportunities" },
                contributingOpportunities: "$contributingOpportunities"
              }
            }
          ]);
    
          // Return the count of won opportunities and the array of opportunity IDs
          return wonOpportunities.length > 0
            ? wonOpportunities[0]
            : { count: 0, opportunityIds: [] };
        } catch (error) {
          console.error("Error calculating won opportunities:", error);
          throw new Error("Failed to calculate won opportunities.");
        }
    }
    
    static getMonthlyRange = (year, month) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0, 23, 59, 59, 999); // Last day of the month
      return { start, end };
    };
    
    static getHeatMapData = async (year, stageId, subStageId, filterOptions)=>{
      if(!year || !stageId ) throw new ClientError("Error in getHearMap", errors.HeatMap.ALL_FIELDS_REQUIRED);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const heatmapData = {};

      for (let month = 0; month < 12; month++) {
          const { start, end } = this.getMonthlyRange(year, month);
          const monthName = months[month];
          
          // Step 1: Get all opportunities that were in the specified stage/sub-stage in this month
          const stageHistoryRecords = await StageHistoryModel.find({
              stage: stageId,
              ...(subStageId ? { 'subStageHistory.subStage': subStageId } : {}),
              entryDate: { $lte: end },
              $or: [{ exitDate: null }, { exitDate: { $gte: start } }]
          }).populate({
              path: 'opportunity',
              populate: { path: 'client' }  // Populate client data for filters
          });

          // Step 2: Extract opportunities from the stage history records
          const opportunitiesInMonth = stageHistoryRecords.map(record => record.opportunity);

          // Step 3: Apply the filter function to opportunities for this month
          const filteredOpportunities = applyFilters(opportunitiesInMonth, filterOptions);

          // Step 4: Add the filtered count to the response data
          heatmapData[monthName] = filteredOpportunities.length;
      }

      return heatmapData 
    }

     static getHeatMap = catchAsyncError(
      async (req, res) => {
        let { year = "2024", stageId, subStageId } = req.body;
        const filterOptions = getFilterOptions(req.query);
        year = Number(year);
        let heatMapData = {};
        for(let i=year-2; i<=year; i++){
          let currentYearData =  await this.getHeatMapData(i.toString(), stageId, subStageId, filterOptions);
          heatMapData[`${i.toString()}`] = currentYearData; 
        }
        return res.status(200).json({ status : "success", message : "Heat Map fetched successfully", data : heatMapData });   
      }
     )
    //  static getHeatData = catchAsyncError( async (year, stageId, subStageId, filterOptions ) => {
    //   try {
        
    
    //     // Initialize an object to store monthly data
    //     const monthlyData = {
    //       Jan: [], Feb: [], Mar: [], Apr: [],
    //       May: [], Jun: [], Jul: [], Aug: [],
    //       Sep: [], Oct: [], Nov: [], Dec: []
    //     };
    
    //     // Loop through each month to gather opportunities
    //     for (let month = 0; month < 12; month++) {
    //       const startOfMonth = new Date(year, month, 1);
    //       const endOfMonth = new Date(year, month + 1, 0);
    
    //       // Fetch opportunities for each month with the given stage and date range
    //       const stageHistories = await StageHistoryModel.find({
    //         stage: stageId,
    //         entryDate: { $lte: endOfMonth },
    //         $or: [
    //           { exitDate: { $gte: startOfMonth } },
    //           { exitDate: null }
    //         ]
    //       })
    //         .populate({
    //           path: 'opportunity',
    //           populate: { path: 'client' }
    //         });
    
    //       // Filter opportunities based on subStageId if provided
    //       const filteredOpportunities = stageHistories.filter(history => {
    //         if (subStageId) {
    //           // Check if any subStageHistory entry matches subStageId and is within the date range
    //           return history.subStageHistory.some(subStageEntry =>
    //             subStageEntry.subStage.toString() === subStageId &&
    //             subStageEntry.entryDate >= startOfMonth &&
    //             subStageEntry.entryDate <= endOfMonth
    //           );
    //         }
    //         return true; // If no subStageId, accept all
    //       });
    
    //       // Apply additional filters from filterOptions
    //       const filteredAndAppliedOpportunities = applyFilters(filteredOpportunities.map(h => h.opportunity), filterOptions);
          
    //       // Store filtered opportunities in the corresponding month
    //       const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    //       monthlyData[monthNames[month]] = filteredAndAppliedOpportunities;
    //     }
    
    //     // Return the final response with the heatmap data
    //     res.status(200).json({ year, monthlyData });
    //   } catch (error) {
    //     console.error('Error generating heatmap data:', error);
    //     res.status(500).json({ status: 'error', message: 'Error generating heatmap data' });
    //   }
    // });


    static getSummaryView = catchAsyncError(async (req, res) => {
        const { startDate = null, endDate = null } = req.body;
        const fsd = startDate ? new Date(startDate) : new Date("2010-01-01");
        const fed = endDate ? new Date(endDate) : new Date(Date.now());
    
        console.log("startDate:", fsd); 
        console.log("endDate:", fed); 
    
        const actualRevenue = await this.getActualRevenue(fsd, fed);
        const expectedRevenue = await this.getExpectedRevenue(fsd, fed);
        const openOpportunities = await this.getOpenOpportunities(fsd, fed);
        const opportunityWonCount = await this.getOpportunityWonCount(fsd, fed);
        const opportunityDistribution = await SummaryViewController.getOpportunityDistribution(req, res, fed);
    
        console.log("Actual Revenue:", actualRevenue);
        console.log("Expected Revenue:", expectedRevenue);
        console.log("Open Opportunities:", openOpportunities);
        console.log("Opportunity Won Count:", opportunityWonCount);
        console.log("Opportunity Distribution:", opportunityDistribution);
    
        return res.send({ status: "success", message: "summary view fetched successfully!", data : {actualRevenue, expectedRevenue,openOpportunities, opportunityWonCount, opportunityDistribution } });
    });
    
    // Ensure `getOpportunityDistribution` uses an arrow function to bind `this`
    static getOpportunityDistribution = async (req, res, endDate) => {
        req.body.particularDate = endDate;  // Should work correctly here
        console.log("request 2:", req);
    
        const pipeView = await PipeViewController.generatePipeView(req, res);
        const funnelStats = await FunnelViewController.getFunnelStateCount(pipeView);
    
        return funnelStats;
    };

}
export default SummaryViewController;