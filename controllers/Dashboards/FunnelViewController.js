import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import SalesStageController from "../Stage/salesStageController.js";
import PipeViewController from "./PipeViewController.js";
import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
import mongoose from "mongoose";
class FunnelViewController{
    static getFunnelStateCount = (pipeView)=>{
        const funnel = {};
        for(const key in pipeView){
           funnel[key] = pipeView[key].length;
        }
        return funnel
    }

    static getConversionRates = async (startDate = new Date("2010-01-01"), endDate = Date.now()) => {
        const stages = await SalesStageController.fetchAllStages();
        stages.sort((a, b) => a.level - b.level);
    
        const conversionRates = await StageHistoryModel.aggregate([
            // Step 1: Filter histories based on entry date range and start stage (Lead)
            {
                $match: {
                    stage: stages[0]._id,
                    entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            },
            // Step 2: Populate opportunity, then populate `stageHistory` within each opportunity
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
                    from: "stagehistories",
                    localField: "opportunity.stageHistory",
                    foreignField: "_id",
                    as: "opportunity.stageHistory"
                }
            },
            // Step 3: Project only necessary fields
            {
                $project: {
                    "opportunity.stageHistory.stage": 1
                }
            },
            // Step 4: Group and calculate conversion rates based on presence of stages in `stageHistory`
            {
                $group: {
                    _id: null,
                    currentStageCount: { $sum: 1 },
                    leadToProspect: {
                        $sum: {
                            $cond: {
                                if: { $in: [stages[1]._id, "$opportunity.stageHistory.stage"] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    prospectToQualification: {
                        $sum: {
                            $cond: {
                                if: { $in: [stages[2]._id, "$opportunity.stageHistory.stage"] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    qualificationToProposal: {
                        $sum: {
                            $cond: {
                                if: { $in: [stages[3]._id, "$opportunity.stageHistory.stage"] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    proposalToFollowup: {
                        $sum: {
                            $cond: {
                                if: { $in: [stages[4]._id, "$opportunity.stageHistory.stage"] },
                                then: 1,
                                else: 0
                            }
                        }
                    },
                    followupToClosing: {
                        $sum: {
                            $cond: {
                                if: { $in: [stages[5]._id, "$opportunity.stageHistory.stage"] },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            },
            // Step 5: Calculate each conversion rate as a percentage, handling division by zero
            {
                $project: {
                    _id: 0,
                    conversionRates: {
                        leadToProspect: {
                            $cond: {
                                if: { $eq: ["$currentStageCount", 0] },
                                then: 0,
                                else: { $multiply: [{ $divide: ["$leadToProspect", "$currentStageCount"] }, 100] }
                            }
                        },
                        prospectToQualification: {
                            $cond: {
                                if: { $eq: ["$leadToProspect", 0] },
                                then: 0,
                                else: { $multiply: [{ $divide: ["$prospectToQualification", "$leadToProspect"] }, 100] }
                            }
                        },
                        qualificationToProposal: {
                            $cond: {
                                if: { $eq: ["$prospectToQualification", 0] },
                                then: 0,
                                else: { $multiply: [{ $divide: ["$qualificationToProposal", "$prospectToQualification"] }, 100] }
                            }
                        },
                        proposalToFollowup: {
                            $cond: {
                                if: { $eq: ["$qualificationToProposal", 0] },
                                then: 0,
                                else: { $multiply: [{ $divide: ["$proposalToFollowup", "$qualificationToProposal"] }, 100] }
                            }
                        },
                        followupToClosing: {
                            $cond: {
                                if: { $eq: ["$proposalToFollowup", 0] },
                                then: 0,
                                else: { $multiply: [{ $divide: ["$followupToClosing", "$proposalToFollowup"] }, 100] }
                            }
                        }
                    }
                }
            }
        ]);
    
        return conversionRates[0].conversionRates;
    };
    

    static getConversionssssRates = async (startDate = new Date("2010-01-01"), endDate = new Date(Date.now())) => {
        const stages = await SalesStageController.fetchAllStages();
        console.log("start date : ", startDate);
        console.log("end date : ", endDate);
        //         stages.sort((a,b)=>a.level - b.level);
         
      
          // Stage IDs for each sales stage
          const lead = stages[0]._id;
          const prospect = stages[1]._id;
          const qualification = stages[2]._id;
          const proposal = stages[3]._id;
          const followup = stages[4]._id;
          const closing = stages[5]._id;
      
          // Aggregation pipeline
          const conversionRates = await StageHistoryModel.aggregate([
            // Stage 1: Filter by date range and initial stage (Lead)
            {
              $match: {
                stage: lead,
                entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
              }
            },
            // Stage 2: Populate `opportunity` and retrieve only `stageHistory` IDs
            {
              $lookup: {
                from: "opportunitymasters",
                localField: "opportunity",
                foreignField: "_id",
                as: "opportunity"
              }
            },
            {
              $unwind: "$opportunity"
            },
            {
              $project: {
                stage: 1,
                entryDate: 1,
                exitDate: 1,
                "opportunity.stageHistory": 1
              }
            },
            // Stage 3: Calculate Conversion Rates for each transition
            {
              $facet: {
                leadToProspect: [
                  { $match: { stage: lead } },
                  {
                    $project: {
                      progressedCount: {
                        $size: {
                          $filter: {
                            input: "$opportunity.stageHistory",
                            as: "history",
                            cond: { $eq: ["$$history.stage", prospect] }
                          }
                        }
                      }
                    }
                  },
                  { $count: "currentStageCount" },
                  {
                    $project: {
                      conversionRate: {
                        $multiply: [
                          { $divide: ["$progressedCount", "$currentStageCount"] },
                          100
                        ]
                      }
                    }
                  }
                ],
                prospectToQualification: [
                  { $match: { stage: prospect } },
                  {
                    $project: {
                      progressedCount: {
                        $size: {
                          $filter: {
                            input: "$opportunity.stageHistory",
                            as: "history",
                            cond: { $eq: ["$$history.stage", qualification] }
                          }
                        }
                      }
                    }
                  },
                  { $count: "currentStageCount" },
                  {
                    $project: {
                      conversionRate: {
                        $multiply: [
                          { $divide: ["$progressedCount", "$currentStageCount"] },
                          100
                        ]
                      }
                    }
                  }
                ],
                qualificationToProposal: [
                  { $match: { stage: qualification } },
                  {
                    $project: {
                      progressedCount: {
                        $size: {
                          $filter: {
                            input: "$opportunity.stageHistory",
                            as: "history",
                            cond: { $eq: ["$$history.stage", proposal] }
                          }
                        }
                      }
                    }
                  },
                  { $count: "currentStageCount" },
                  {
                    $project: {
                      conversionRate: {
                        $multiply: [
                          { $divide: ["$progressedCount", "$currentStageCount"] },
                          100
                        ]
                      }
                    }
                  }
                ],
                proposalToFollowup: [
                  { $match: { stage: proposal } },
                  {
                    $project: {
                      progressedCount: {
                        $size: {
                          $filter: {
                            input: "$opportunity.stageHistory",
                            as: "history",
                            cond: { $eq: ["$$history.stage", followup] }
                          }
                        }
                      }
                    }
                  },
                  { $count: "currentStageCount" },
                  {
                    $project: {
                      conversionRate: {
                        $multiply: [
                          { $divide: ["$progressedCount", "$currentStageCount"] },
                          100
                        ]
                      }
                    }
                  }
                ],
                followupToClosing: [
                  { $match: { stage: followup } },
                  {
                    $project: {
                      progressedCount: {
                        $size: {
                          $filter: {
                            input: "$opportunity.stageHistory",
                            as: "history",
                            cond: { $eq: ["$$history.stage", closing] }
                          }
                        }
                      }
                    }
                  },
                  { $count: "currentStageCount" },
                  {
                    $project: {
                      conversionRate: {
                        $multiply: [
                          { $divide: ["$progressedCount", "$currentStageCount"] },
                          100
                        ]
                      }
                    }
                  }
                ]
              }
            },
            // Stage 4: Restructure results to a single object with all conversion rates
            {
              $project: {
                conversionRates: {
                  leadToProspect: { $arrayElemAt: ["$leadToProspect.conversionRate", 0] },
                  prospectToQualification: {
                    $arrayElemAt: ["$prospectToQualification.conversionRate", 0]
                  },
                  qualificationToProposal: {
                    $arrayElemAt: ["$qualificationToProposal.conversionRate", 0]
                  },
                  proposalToFollowup: {
                    $arrayElemAt: ["$proposalToFollowup.conversionRate", 0]
                  },
                  followupToClosing: {
                    $arrayElemAt: ["$followupToClosing.conversionRate", 0]
                  }
                }
              }
            }
          ]);
      
        return conversionRates[0].conversionRates
      }

    static getFunnelView = catchAsyncError(async (req, res, next) => {
        const { startDate, endDate } = req.query;
        const pipeView = await PipeViewController.generatePipeView(req,res,next);
        const funnelStats =  this.getFunnelStateCount(pipeView);
        const conversionStats = await this.getConversionRates(startDate, endDate);
        res.status(200).json({
            status: "success",
            message: "Funnel view retrieved successfully",
            data: {
                funnelStats,
                conversionStats
            }
          });
    })



}

export default FunnelViewController;