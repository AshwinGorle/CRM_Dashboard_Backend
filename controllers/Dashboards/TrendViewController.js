import mongoose from "mongoose";
import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
import { getFilterOptions } from "../../utils/searchOptions.js";

class TrendViewController {
    static getTrendView = async (req, res, next) => {
        try {
            const filterOptions = getFilterOptions(req?.query);

            // Step 1: Build the filter query
            const filters = {};

            if (filterOptions.territory) {
                filters["client.territory"] = {
                    $in: filterOptions.territory.map((id) => new mongoose.Types.ObjectId(id)),
                };
            }
            if (filterOptions.industry) {
                filters["client.industry"] = {
                    $in: filterOptions.industry.map((id) => new mongoose.Types.ObjectId(id)),
                };
            }
            if (filterOptions.subIndustry) {
                filters["client.subIndustry"] = {
                    $in: filterOptions.subIndustry.map((id) => new mongoose.Types.ObjectId(id)),
                };
            }
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

            console.log("DB Filters -----------", filters);

            // Filter for won opportunities in the past 10 years (closingDate not null)
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - 10;
            filters.closingDate = {
                $gte: new Date(`${startYear}-01-01`),
                $lte: new Date(`${currentYear}-12-31`),
            };

            // Step 2: Fetch opportunities matching filters (without populating initially)
            const opportunities = await OpportunityMasterModel.find(
                { ...filters, closingDate: { $ne: null } }, // Ensures only won opportunities
                {
                    expectedSales: 1,
                    closingDate: 1,
                    projectName: 1,
                    client: 1,
                }
            ).populate({
                path: "client", // Populate the client field after filtering
                select: "_id name territory industry subIndustry", // Include required client fields
                populate: {
                    path: "territory", // Populate territory within client
                    select: "_id label", // Include territory ID and label
                },
            });

            // Step 3: Aggregate revenues by year and collect contributing opportunities
            const trendData = {};
            for (let year = startYear; year <= currentYear; year++) {
                trendData[year] = {
                    revenue: 0,
                    contributingOpportunities: [],
                };
            }

            opportunities.forEach((opportunity) => {
                const closingYear = new Date(opportunity.closingDate).getFullYear();
                if (trendData[closingYear]) {
                    trendData[closingYear].revenue += opportunity.expectedSales || 0;
                    trendData[closingYear].contributingOpportunities.push({
                        opportunityId: opportunity._id,
                        project_name: opportunity.projectName,
                        expectedSales: opportunity.expectedSales || 0,
                        clientId: opportunity.client?._id,
                        client: opportunity.client?.name,
                        territoryId: opportunity.client?.territory?._id,
                        territoryName: opportunity.client?.territory?.label, // Fixed issue with territory label
                    });
                }
            });

            // Step 4: Return response
            return res.status(200).json(trendData);
        } catch (error) {
            console.error("Error in getTrendView:", error);
            next(error);
        }
    };
}

export default TrendViewController;
