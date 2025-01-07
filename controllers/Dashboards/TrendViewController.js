



// import mongoose from "mongoose";
// import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
// import { getFilterOptions } from "../../utils/searchOptions.js";

// class TrendViewController {
//     static getTrendView = async (req, res, next) => {
//         try {
//             const filterOptions = getFilterOptions(req?.query);

//             // Parse the date range for the last 10 years
//             const currentYear = new Date().getFullYear();
//             const startYear = currentYear - 10;
//             const startDate = new Date(`${startYear}-01-01`);
//             const endDate = new Date(`${currentYear}-12-31`);

//             // Construct the match conditions for filters
//             const matchConditions = {
//                 closingDate: { $ne: null, $gte: startDate, $lte: endDate }, // Ensure won opportunities
//             };

//             if (filterOptions.territory) {
//                 matchConditions["client.territory"] = {
//                     $in: filterOptions.territory.map((id) => new mongoose.Types.ObjectId(id)),
//                 };
//             }
//             if (filterOptions.industry) {
//                 matchConditions["client.industry"] = {
//                     $in: filterOptions.industry.map((id) => new mongoose.Types.ObjectId(id)),
//                 };
//             }
//             if (filterOptions.subIndustry) {
//                 matchConditions["client.subIndustry"] = {
//                     $in: filterOptions.subIndustry.map((id) => new mongoose.Types.ObjectId(id)),
//                 };
//             }
//             if (filterOptions.solution) {
//                 matchConditions.solution = {
//                     $in: filterOptions.solution.map((id) => new mongoose.Types.ObjectId(id)),
//                 };
//             }
//             if (filterOptions.enteredBy) {
//                 matchConditions.enteredBy = {
//                     $in: filterOptions.enteredBy.map((id) => new mongoose.Types.ObjectId(id)),
//                 };
//             }

//             console.log("DB Match Conditions:", matchConditions);

//             // Aggregate the data using MongoDB's aggregation pipeline
//             const opportunities = await OpportunityMasterModel.aggregate([
//                 // Step 1: Match opportunities based on the filters
//                 { $match: matchConditions },

//                 // Step 2: Lookup to join with ClientMaster
//                 {
//                     $lookup: {
//                         from: "clientmasters", // Name of the ClientMaster collection
//                         localField: "client",
//                         foreignField: "_id",
//                         as: "client",
//                     },
//                 },

//                 // Step 3: Unwind the client array (because $lookup returns an array)
//                 { $unwind: "$client" },

//                 // Step 4: Filter opportunities further after lookup
//                 {
//                     $match: {
//                         ...(filterOptions.territory && {
//                             "client.territory": { $in: filterOptions.territory.map((id) => new mongoose.Types.ObjectId(id)) },
//                         }),
//                         ...(filterOptions.industry && {
//                             "client.industry": { $in: filterOptions.industry.map((id) => new mongoose.Types.ObjectId(id)) },
//                         }),
//                         ...(filterOptions.subIndustry && {
//                             "client.subIndustry": { $in: filterOptions.subIndustry.map((id) => new mongoose.Types.ObjectId(id)) },
//                         }),
//                     },
//                 },

//                 // Step 5: Project the necessary fields
//                 {
//                     $project: {
//                         _id: 1,
//                         expectedSales: 1,
//                         closingDate: 1,
//                         projectName: 1,
//                         client: {
//                             _id: 1,
//                             name: 1,
//                             territory: 1,
//                             industry: 1,
//                             subIndustry: 1,
//                         },
//                     },
//                 },
//             ]);

//             console.log("Filtered Opportunities:", opportunities);

//             // Step 6: Aggregate revenues by year and prepare the response
//             const trendData = {};
//             for (let year = startYear; year <= currentYear; year++) {
//                 trendData[year] = {
//                     revenue: 0,
//                     contributingOpportunities: [],
//                 };
//             }

//             opportunities.forEach((opportunity) => {
//                 const closingYear = new Date(opportunity.closingDate).getFullYear();
//                 if (trendData[closingYear]) {
//                     trendData[closingYear].revenue += opportunity.expectedSales || 0;
//                     trendData[closingYear].contributingOpportunities.push({
//                         opportunityId: opportunity._id,
//                         project_name: opportunity.projectName,
//                         expectedSales: opportunity.expectedSales || 0,
//                         clientId: opportunity.client?._id,
//                         client: opportunity.client?.name,
//                         territoryId: opportunity.client?.territory,
//                     });
//                 }
//             });

//             // Step 7: Return the aggregated data
//             return res.status(200).json(trendData);
//         } catch (error) {
//             console.error("Error in getTrendView:", error);
//             next(error);
//         }
//     };
// }

// export default TrendViewController;

// import mongoose from "mongoose";
// import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
// import { getFilterOptions } from "../../utils/searchOptions.js";

// class TrendViewController {
//     static getTrendView = async (req, res, next) => {
//         try {
//             const filterOptions = getFilterOptions(req?.query);

//             // Step 1: Build the filter query
//             const filters = {};

//             // if (filterOptions.territory) {
//             //     filters["client.territory"] = {
//             //         $in: filterOptions.territory.map((id) => new mongoose.Types.ObjectId(id)),
//             //     };
//             // }
//             // if (filterOptions.industry) {
//             //     filters["client.industry"] = {
//             //         $in: filterOptions.industry.map((id) => new mongoose.Types.ObjectId(id)),
//             //     };
//             // }
//             // if (filterOptions.subIndustry) {
//             //     filters["client.subIndustry"] = {
//             //         $in: filterOptions.subIndustry.map((id) => new mongoose.Types.ObjectId(id)),
//             //     };
//             // }
//             if (filterOptions.solution) {
//                 filters.solution = {
//                     $in: filterOptions.solution.map((id) => new mongoose.Types.ObjectId(id)),
//                 };
//             }
//             if (filterOptions.enteredBy) {
//                 filters.enteredBy = {
//                     $in: filterOptions.enteredBy.map((id) => new mongoose.Types.ObjectId(id)),
//                 };
//             }

//             // Filter for won opportunities in the past 10 years (closingDate not null)
//             const currentYear = new Date().getFullYear();
//             const startYear = currentYear - 10;
//             filters.closingDate = {
//                 $gte: new Date(`${startYear}-01-01`),
//                 $lte: new Date(`${currentYear}-12-31`),
//             };

//             // Step 2: Fetch opportunities matching filters
//             const opportunities = await OpportunityMasterModel.find(
//                 { ...filters, closingDate: { $ne: null } }, // Ensures only won opportunities
//                 {
//                     expectedSales: 1,
//                     closingDate: 1,
//                     projectName: 1,
//                     client: 1,
//                 }
//             ).populate({
//                 path: "client", // Populate the client field
//                 select: "_id name territory industry subIndustry", // Include required client fields
//                 populate: {
//                     path: "territory industry subIndustry", // Populate territory within client
//                     select: "_id label", // Include territory ID and label
//                 },
//             });

//             // after fetching opportunity, filter the opportunities according to industry, subIndustry and territory here  as filteredOpportunities and below it use this filteredOpportunities instead of opportunities

//             // Step 3: Aggregate revenues by year and collect contributing opportunities
//             const trendData = {};
//             for (let year = startYear; year <= currentYear; year++) {
//                 trendData[year] = {
//                     revenue: 0,
//                     contributingOpportunities: [],
//                 };
//             }

//             opportunities.forEach((opportunity) => {
//                 const closingYear = new Date(opportunity.closingDate).getFullYear();
//                 if (trendData[closingYear]) {
//                     trendData[closingYear].revenue += opportunity.expectedSales || 0;
//                     trendData[closingYear].contributingOpportunities.push({
//                         opportunityId: opportunity._id,
//                         project_name: opportunity.projectName,
//                         expectedSales: opportunity.expectedSales || 0,
//                         clientId: opportunity.client?._id,
//                         client: opportunity.client?.name,
//                         territoryName: opportunity.client?.territory?.label, // Fixed issue with territory label
//                         territory: opportunity.client?.territory,
//                         industry: opportunity.client?.industry,
//                         subIndustry: opportunity.client?.subIndustry
//                         // territoryId: opportunity.client?.territory?._id.toString(),
//                         // industryId: opportunity.client?.industry?.toString(),
//                         // subIndustryId: opportunity.client?.subIndustry.toString(),
//                     });
//                 }
//             });

//             // Step 4: Return response
//             return res.status(200).json(trendData);
//         } catch (error) {
//             console.error("Error in getTrendView:", error);
//             next(error);
//         }
//     };
// }

// export default TrendViewController;

import mongoose from "mongoose";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { getFilterOptions } from "../../utils/searchOptions.js";

class TrendViewController {
    static getTrendView = async (req, res, next) => {
        try {
            const filterOptions = getFilterOptions(req?.query);

            // Step 1: Build the initial filter query (excluding territory, industry, subIndustry)
            const filters = {};

            if (filterOptions.solution) {
                filters.solution = {
                    $in: filterOptions.solution.map((id) => new mongoose.Types.ObjectId(id)),
                };
            }
            if (filterOptions.enteredBy) {
                filters.enteredBy = {
                    $in: filterOptions.enteredBy.map((id) => new mongoose.Types.ObjectId(id)),
                };
            }

            // Filter for won opportunities in the past 10 years (closingDate not null)
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - 10;
            filters.closingDate = {
                $gte: new Date(`${startYear}-01-01`),
                $lte: new Date(`${currentYear}-12-31`),
            };

            // Step 2: Fetch opportunities from the database
            const opportunities = await OpportunityMasterModel.find(
                { ...filters, closingDate: { $ne: null } }, // Ensures only won opportunities
                {
                    expectedSales: 1,
                    closingDate: 1,
                    projectName: 1,
                    client: 1,
                }
            ).populate({
                path: "client",
                select: "_id name territory industry subIndustry",
                populate: {
                    path: "territory industry subIndustry",
                    select: "_id label",
                },
            });

            // Step 3: Apply additional filters (territory, industry, subIndustry)
            const filteredOpportunities = opportunities.filter((opportunity) => {
                const client = opportunity.client || {};
                const matchesTerritory =
                    !filterOptions.territory ||
                    filterOptions.territory.some((id) =>
                        client.territory?._id?.toString() === id
                    );
                const matchesIndustry =
                    !filterOptions.industry ||
                    filterOptions.industry.some((id) =>
                        client.industry?._id?.toString() === id
                    );
                const matchesSubIndustry =
                    !filterOptions.subIndustry ||
                    filterOptions.subIndustry.some((id) =>
                        client.subIndustry?._id?.toString() === id
                    );

                return matchesTerritory && matchesIndustry && matchesSubIndustry;
            });

            // Step 4: Aggregate revenues by year and collect contributing opportunities
            const trendData = {};
            for (let year = startYear; year <= currentYear; year++) {
                trendData[year] = {
                    revenue: 0,
                    contributingOpportunities: [],
                };
            }

            filteredOpportunities.forEach((opportunity) => {
                const closingYear = new Date(opportunity.closingDate).getFullYear();
                if (trendData[closingYear]) {
                    trendData[closingYear].revenue += opportunity.expectedSales || 0;
                    trendData[closingYear].contributingOpportunities.push({
                        opportunityId: opportunity._id,
                        project_name: opportunity.projectName,
                        expectedSales: opportunity.expectedSales || 0,
                        clientId: opportunity.client?._id,
                        client: opportunity.client?.name,
                        territoryName: opportunity.client?.territory?.label,
                        industryName: opportunity.client?.industry?.label,
                        subIndustryName: opportunity.client?.subIndustry?.label,
                    });
                }
            });

            // Step 5: Return the aggregated data
            return res.status(200).json(trendData);
        } catch (error) {
            console.error("Error in getTrendView:", error);
            next(error);
        }
    };
}

export default TrendViewController;
