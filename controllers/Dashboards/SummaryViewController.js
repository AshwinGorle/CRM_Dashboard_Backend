import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { getTargetsForYear } from "../../service/targetService.js";
import SolutionModel from "../../models/Configuration/SolutionModel.js";
import IndustryMasterModel from "../../models/Configuration/IndustryModel.js";
import TerritoryModel from "../../models/Configuration/TerritoryModel.js";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";

class SummaryViewController {
    static getYearQuarters = (year) => {
        if (!Number.isInteger(year)) {
            throw new Error("Year must be an integer.");
        }
        return {
            year: year.toString(),
            q1: { startDate: `${year}-01-01T00:00:00.000Z`, endDate: `${year}-03-31T23:59:59.999Z` },
            q2: { startDate: `${year}-04-01T00:00:00.000Z`, endDate: `${year}-06-30T23:59:59.999Z` },
            q3: { startDate: `${year}-07-01T00:00:00.000Z`, endDate: `${year}-09-30T23:59:59.999Z` },
            q4: { startDate: `${year}-10-01T00:00:00.000Z`, endDate: `${year}-12-31T23:59:59.999Z` },
        };
    };

    // static getSummaryView = async (opportunities, entityType, year) => {
    //     let allEntities;
    //     if (entityType === "Territory") {
    //         allEntities = await TerritoryModel.find({}, { label: 1 });
    //     } else if (entityType === "Industry") {
    //         allEntities = await IndustryMasterModel.find({}, { label: 1 });
    //     } else if (entityType === "Solution") {
    //         allEntities = await SolutionModel.find({}, { label: 1 });
    //     }

    //     // Fetch targets for the given entityType and year
    //     const targets = await getTargetsForYear(entityType, year);

    //     // Initialize a map for actual revenues
    //     const actualRevenueMap = {};

    //     // Process opportunities based on entityType
    //     opportunities.forEach((opportunity) => {
    //         let entityId, entityLabel;

    //         if (entityType === "Territory") {
    //             entityId = opportunity.client?.territory?._id?.toString();
    //             entityLabel = opportunity.client?.territory?.label;
    //         } else if (entityType === "Industry") {
    //             entityId = opportunity.client?.industry?._id?.toString();
    //             entityLabel = opportunity.client?.industry?.label;
    //         } else if (entityType === "Solution") {
    //             entityId = opportunity.solution?._id?.toString();
    //             entityLabel = opportunity.solution?.label;
    //         }

    //         if (entityId) {
    //             // Initialize entity's actual revenue if not already done
    //             if (!actualRevenueMap[entityId]) {
    //                 actualRevenueMap[entityId] = {
    //                     label: entityLabel,
    //                     actual: { q1: 0, q2: 0, q3: 0, q4: 0 },
    //                 };
    //             }

    //             // Determine the quarter for the closingDate
    //             const closingDate = new Date(opportunity.closingDate);
    //             const quarters = this.getYearQuarters(year);
    //             for (const [quarter, { startDate, endDate }] of Object.entries(quarters)) {
    //                 if (
    //                     closingDate >= new Date(startDate) &&
    //                     closingDate <= new Date(endDate)
    //                 ) {
    //                     actualRevenueMap[entityId].actual[quarter] +=
    //                         opportunity.expectedSales || 0;
    //                     break;
    //                 }
    //             }
    //         }
    //     });

    //     // Combine targets and actuals for all entities
    //     return allEntities.map((entity) => {
    //         const entityId = entity._id.toString();
    //         const target = targets.find((t) => t.entityId === entityId);
    //         const actual = actualRevenueMap[entityId]?.actual || { q1: 0, q2: 0, q3: 0, q4: 0 };

    //         return {
    //             entityId,
    //             label: entity.label,
    //             year: year.toString(),
    //             targets: target?.targets || { q1: 0, q2: 0, q3: 0, q4: 0 },
    //             actual,
    //         };
    //     });
    // };
     
    static getSummaryView = async (opportunities, entityType, year) => {
        let allEntities;
        if (entityType === "Territory") {
            allEntities = await TerritoryModel.find({}, { label: 1 });
        } else if (entityType === "Industry") {
            allEntities = await IndustryMasterModel.find({}, { label: 1 });
        } else if (entityType === "Solution") {
            allEntities = await SolutionModel.find({}, { label: 1 });
        }
    
        // Fetch targets for the given entityType and year
        const targets = await getTargetsForYear(entityType, year);
    
        // Create a map for targets for fast lookup
        const targetMap = targets.reduce((map, target) => {
            map[target.entityId] = target.targets;
            return map;
        }, {});
    
        // Initialize a map for actual revenues
        const actualRevenueMap = {};
    
        // Process opportunities based on entityType
        opportunities.forEach((opportunity) => {
            let entityId, entityLabel;
    
            if (entityType === "Territory") {
                entityId = opportunity.client?.territory?._id?.toString();
                entityLabel = opportunity.client?.territory?.label;
            } else if (entityType === "Industry") {
                entityId = opportunity.client?.industry?._id?.toString();
                entityLabel = opportunity.client?.industry?.label;
            } else if (entityType === "Solution") {
                entityId = opportunity.solution?._id?.toString();
                entityLabel = opportunity.solution?.label;
            }
    
            if (entityId) {
                // Initialize entity's actual revenue if not already done
                if (!actualRevenueMap[entityId]) {
                    actualRevenueMap[entityId] = {
                        label: entityLabel,
                        actual: { q1: 0, q2: 0, q3: 0, q4: 0 },
                    };
                }
    
                // Determine the quarter for the closingDate
                const closingDate = new Date(opportunity.closingDate);
                const quarters = SummaryViewController.getYearQuarters(year);
                for (const [quarter, { startDate, endDate }] of Object.entries(quarters)) {
                    if (
                        closingDate >= new Date(startDate) &&
                        closingDate <= new Date(endDate)
                    ) {
                        actualRevenueMap[entityId].actual[quarter] +=
                            opportunity.expectedSales || 0;
                        break;
                    }
                }
            }
        });
    
        // Combine targets and actuals for all entities
        return allEntities.map((entity) => {
            const entityId = entity._id.toString();
            const targets = targetMap[entityId] || { q1: 0, q2: 0, q3: 0, q4: 0 };
            const actual = actualRevenueMap[entityId]?.actual || { q1: 0, q2: 0, q3: 0, q4: 0 };
    
            return {
                entityId,
                label: entity.label,
                year: year.toString(),
                targets,
                actual,
            };
        });
    };

    
    static getIntireSummaryView = catchAsyncError(async (req, res) => {
        let { year } = req.body;
        year = Number(year)

        // Step 1: Fetch opportunities won in the given year
        const quarterDetails = this.getYearQuarters(Number(year));
        const opportunities = await OpportunityMasterModel.find(
            {
                closingDate: { $gte: quarterDetails.q1.startDate, $lte: quarterDetails.q4.endDate },
            },
            { closingDate: 1, expectedSales: 1, client: 1, solution: 1 } // Fetch only required fields
        ).populate({
            path: "client",
            select: "territory industry", // Fetch territory and industry from client
            populate: [
                { path: "territory", select: "label" },
                { path: "industry", select: "label" },
            ],
        });

        // Step 2: Call getSummaryView for each entityType
        const territorySummaryView = await SummaryViewController.getSummaryView(
            opportunities,
            "Territory",
            year
        );
        const industrySummaryView = await SummaryViewController.getSummaryView(
            opportunities,
            "Industry",
            year
        );
        const solutionSummaryView = await SummaryViewController.getSummaryView(
            opportunities,
            "Solution",
            year
        );

        // Step 3: Return the combined result
        res.status(200).json({
            territorySummaryView,
            industrySummaryView,
            solutionSummaryView,
        });
    });
}

export default SummaryViewController;
