import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SalesStageController from "../Stage/salesStageController.js";
import PipeViewController from "./PipeViewController.js";
import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
import mongoose from "mongoose";
import { getFilterOptions } from "../../utils/searchOptions.js";
class FunnelViewController{
    static getFunnelStateCount = (pipeView)=>{ 
        const funnel = {};
        for(const key in pipeView){
           funnel[key] = pipeView[key].length;
        }
        const wonSubStageId =  new mongoose.Types.ObjectId("670e81150a2c8e8563f16b55");
        funnel.won = pipeView?.closing?.reduce(( acc, opportunity)=>{
                  if(opportunity?.salesSubStage?.toString() == wonSubStageId?.toString()) return acc += 1;
                  else return acc;
        },0);
        console.log("funnel view won count-------------", funnel.won )
        // funnel.won = funnel.won.length;
        return funnel;
    }

    // static getConversionRates = async (startDate = new Date("2010-01-01"), endDate = Date.now()) => {
    //     const stages = await SalesStageController.fetchAllStages();
    //     stages.sort((a, b) => a.level - b.level);
    
    //     const conversionRates = await StageHistoryModel.aggregate([
    //         // Step 1: Filter histories based on entry date range and start stage (Lead)
    //         {
    //             $match: {
    //                 stage: stages[0]._id,
    //                 entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
    //             }
    //         },
    //         // Step 2: Populate opportunity, then populate `stageHistory` within each opportunity
    //         {
    //             $lookup: {
    //                 from: "opportunitymasters",
    //                 localField: "opportunity",
    //                 foreignField: "_id",
    //                 as: "opportunity"
    //             }
    //         },
    //         { $unwind: "$opportunity" },
    //         {
    //             $lookup: {
    //                 from: "stagehistories",
    //                 localField: "opportunity.stageHistory",
    //                 foreignField: "_id",
    //                 as: "opportunity.stageHistory"
    //             }
    //         },
    //         // Step 3: Project only necessary fields
    //         {
    //             $project: {
    //                 "opportunity.stageHistory.stage": 1
    //             }
    //         },
    //         // Step 4: Group and calculate conversion rates based on presence of stages in `stageHistory`
    //         {
    //             $group: {
    //                 _id: null,
    //                 currentStageCount: { $sum: 1 },
    //                 leadToProspect: {
    //                     $sum: {
    //                         $cond: {
    //                             if: { $in: [stages[1]._id, "$opportunity.stageHistory.stage"] },
    //                             then: 1,
    //                             else: 0
    //                         }
    //                     }
    //                 },
    //                 prospectToQualification: {
    //                     $sum: {
    //                         $cond: {
    //                             if: { $in: [stages[2]._id, "$opportunity.stageHistory.stage"] },
    //                             then: 1,
    //                             else: 0
    //                         }
    //                     }
    //                 },
    //                 qualificationToProposal: {
    //                     $sum: {
    //                         $cond: {
    //                             if: { $in: [stages[3]._id, "$opportunity.stageHistory.stage"] },
    //                             then: 1,
    //                             else: 0
    //                         }
    //                     }
    //                 },
    //                 proposalToFollowup: {
    //                     $sum: {
    //                         $cond: {
    //                             if: { $in: [stages[4]._id, "$opportunity.stageHistory.stage"] },
    //                             then: 1,
    //                             else: 0
    //                         }
    //                     }
    //                 },
    //                 followupToClosing: {
    //                     $sum: {
    //                         $cond: {
    //                             if: { $in: [stages[5]._id, "$opportunity.stageHistory.stage"] },
    //                             then: 1,
    //                             else: 0
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         // Step 5: Calculate each conversion rate as a percentage, handling division by zero
    //         {
    //             $project: {
    //                 _id: 0,
    //                 conversionRates: {
    //                     leadToProspect: {
    //                         $cond: {
    //                             if: { $eq: ["$currentStageCount", 0] },
    //                             then: 0,
    //                             else: { $multiply: [{ $divide: ["$leadToProspect", "$currentStageCount"] }, 100] }
    //                         }
    //                     },
    //                     prospectToQualification: {
    //                         $cond: {
    //                             if: { $eq: ["$leadToProspect", 0] },
    //                             then: 0,
    //                             else: { $multiply: [{ $divide: ["$prospectToQualification", "$leadToProspect"] }, 100] }
    //                         }
    //                     },
    //                     qualificationToProposal: {
    //                         $cond: {
    //                             if: { $eq: ["$prospectToQualification", 0] },
    //                             then: 0,
    //                             else: { $multiply: [{ $divide: ["$qualificationToProposal", "$prospectToQualification"] }, 100] }
    //                         }
    //                     },
    //                     proposalToFollowup: {
    //                         $cond: {
    //                             if: { $eq: ["$qualificationToProposal", 0] },
    //                             then: 0,
    //                             else: { $multiply: [{ $divide: ["$proposalToFollowup", "$qualificationToProposal"] }, 100] }
    //                         }
    //                     },
    //                     followupToClosing: {
    //                         $cond: {
    //                             if: { $eq: ["$proposalToFollowup", 0] },
    //                             then: 0,
    //                             else: { $multiply: [{ $divide: ["$followupToClosing", "$proposalToFollowup"] }, 100] }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     ]);
    
    //     return conversionRates[0]?.conversionRates;
    // };
    
  
  
    
    static getConversionRates = async (startDate = new Date("2010-01-01"), endDate = Date.now(), req) => {
        const filterOptions = getFilterOptions(req?.query); // Extract filter options from query
        console.log("filter ----", filterOptions);
        
        // Fetch stages and sort them
        const stages = await SalesStageController.fetchAllStages();
        stages.sort((a, b) => a.level - b.level);   
    
        // Helper function to build a match query with filters
        const buildFilterQuery = (filterOptions) => {
            let filterQuery = {};
    
            // Convert string IDs to ObjectIds (for proper MongoDB comparison)
            const toObjectIdArray = (array) => {
                return array.map(id => new mongoose.Types.ObjectId(id));
            };
    
            // Apply filters to the query
            if (filterOptions.territory?.length) {
                filterQuery["opportunity.client.territory"] = { $in: toObjectIdArray(filterOptions.territory) };
            }
            if (filterOptions.industry?.length) {
                filterQuery["opportunity.client.industry"] = { $in: toObjectIdArray(filterOptions.industry) };
            }
            if (filterOptions.subIndustry?.length) {
                filterQuery["opportunity.client.subIndustry"] = { $in: toObjectIdArray(filterOptions.subIndustry) };
            }
            if (filterOptions.solution?.length) {
                filterQuery["opportunity.solution"] = { $in: filterOptions.solution };
            }
            if (filterOptions.enteredBy?.length) {
                filterQuery["opportunity.enteredBy"] = { $in: filterOptions.enteredBy };
            }
    
            return filterQuery;
        };
    
        // Function to calculate conversion rates between stages
        const calculateConversionRate = async (fromStage, toStage) => {
            const filterQuery = buildFilterQuery(filterOptions); // Get the filter query
    
            // Stage 1: Count opportunities in the `fromStage`
            const fromStageCount = await StageHistoryModel.aggregate([
                {
                    $match: {
                        stage: fromStage,
                        entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
                        ...filterQuery  // Apply filters
                    }
                },
                {
                    $lookup: {
                        from: "opportunitymasters",
                        localField: "opportunity",
                        foreignField: "_id",
                        as: "opportunity"
                    }
                },
                { $unwind: "$opportunity" },
                {
                    $lookup: {
                        from: "clients",
                        localField: "opportunity.client",
                        foreignField: "_id",
                        as: "opportunity.client"
                    }
                },
                { $unwind: "$opportunity.client" },  // Ensure client is populated
                {
                    $count: "count"
                }
            ]);
            
            const fromStageCountValue = fromStageCount.length > 0 ? fromStageCount[0].count : 0;
    
            if (fromStageCountValue === 0) return 0;
    
            // Stage 2: Count opportunities that have moved to the `toStage`
            const toStageCount = await StageHistoryModel.aggregate([
                {
                    $match: {
                        stage: toStage,
                        entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
                        ...filterQuery  // Apply filters
                    }
                },
                {
                    $lookup: {
                        from: "opportunitymasters",
                        localField: "opportunity",
                        foreignField: "_id",
                        as: "opportunity"
                    }
                },
                { $unwind: "$opportunity" },
                {
                    $lookup: {
                        from: "clientmasters",
                        localField: "opportunity.client",
                        foreignField: "_id",
                        as: "opportunity.client"
                    }
                },
                { $unwind: "$opportunity.client" },  // Ensure client is populated
                {
                    $count: "count"
                }
            ]);
    
            const toStageCountValue = toStageCount.length > 0 ? toStageCount[0].count : 0;
    
            // Calculate conversion rate as a percentage
            return (toStageCountValue / fromStageCountValue) * 100;
        };
    
        // Calculate conversion rates for each stage-to-stage transition
        const leadToProspectRate = await calculateConversionRate(stages[0]._id, stages[1]._id);
        const prospectToQualificationRate = await calculateConversionRate(stages[1]._id, stages[2]._id);
        const qualificationToProposalRate = await calculateConversionRate(stages[2]._id, stages[3]._id);
        const proposalToFollowupRate = await calculateConversionRate(stages[3]._id, stages[4]._id);
        const followupToClosingRate = await calculateConversionRate(stages[4]._id, stages[5]._id);
    
        // Construct the result object
        const conversionRates = {
            leadToProspect: leadToProspectRate,
            prospectToQualification: prospectToQualificationRate,
            qualificationToProposal: qualificationToProposalRate,
            proposalToFollowup: proposalToFollowupRate,
            followupToClosing: followupToClosingRate,
        };
    
        return conversionRates;
    };
    

  

 
    static getFunnelView = catchAsyncError(async (req, res, next) => {
        let {particularDate} = req.body;
        const startDate = new Date("10-01-01");
        const endDate = particularDate;
        console.log("getFunnelView called  endDate:" , "   ", endDate);
        req.body.particularDate = particularDate;
        const pipeView = await PipeViewController.generatePipeView(req,res,next);
        const funnelStats =  this.getFunnelStateCount(pipeView);
        const conversionStats = await this.getConversionRates(startDate, endDate, req);
        console.log("funnelStats : ",funnelStats);
        const wonCount = funnelStats.won;
        delete funnelStats.won
        res.status(200).json({
            status: "success",
            message: "Funnel view retrieved successfully",
            data: {
                funnelStats,
                conversionStats,
                wonCount : wonCount
            }
          });
    })

}

export default FunnelViewController;