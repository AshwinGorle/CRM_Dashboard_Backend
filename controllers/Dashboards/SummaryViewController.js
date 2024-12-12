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

import {
  appendCompareStats,
  getMyViewFilter,
} from "../../utils/dashboards.utils.js";
class SummaryViewController {
  // static async getExpectedRevenue(startDate, endDate, myView, mySIT) {
  //   const {mySolution, myIndustry, myTerritory} = mySIT;
  //   try {
  //     const result = await OpportunityMasterModel.aggregate([
  //       // Match opportunities with an expectedWonDate within the specified range
  //       {
  //         $match: {
  //           expectedWonDate: {
  //             $gte: new Date(startDate),
  //             $lte: new Date(endDate),
  //           },
  //         },
  //       },
  //       // Group to calculate total expected revenue and collect opportunity IDs
  //       {
  //         $group: {
  //           _id: null,
  //           totalExpectedRevenue: { $sum: "$expectedSales" },
  //           contributingOpportunities: { $push: "$_id" },
  //         },
  //       },
  //       // Project the final result, removing the `_id` field
  //       {
  //         $project: {
  //           _id: 0,
  //           totalExpectedRevenue: 1,
  //           contributingOpportunities: 1,
  //         },
  //       },
  //     ]);

  //     // Return the total expected revenue and contributing opportunities array
  //     return result.length > 0
  //       ? {
  //           value: result[0].totalExpectedRevenue,
  //           contributingOpportunities: result[0].contributingOpportunities,
  //         }
  //       : {
  //           value: 0,
  //           contributingOpportunities: [],
  //         };
  //   } catch (error) {
  //     console.error("Error calculating expected revenue:", error);
  //     throw new Error("Failed to calculate expected revenue.");
  //   }
  // }

  static async getExpectedRevenue(startDate, endDate, myView, mySIT) {
    const mySolution = mySIT?.mySolution;
    const myIndustry = mySIT?.myIndustry;
    const myTerritory = mySIT?.myTerritory;
    console.log("sdf edf expected sales", startDate, endDate);
    try {
      // Step 1: Calculate the total expected revenue without myView filtering
      const result = await OpportunityMasterModel.aggregate([
        {
          $match: {
            expectedWonDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalExpectedRevenue: { $sum: "$expectedSales" },
            contributingOpportunities: { $push: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            totalExpectedRevenue: 1,
            contributingOpportunities: 1,
          },
        },
      ]);

      const totalExpectedRevenue =
        result.length > 0 ? result[0].totalExpectedRevenue : 0;
      const contributingOpportunities =
        result.length > 0 ? result[0].contributingOpportunities : [];

      console.log(
        "expected revenue contributing --------",
        contributingOpportunities,
        totalExpectedRevenue
      );

      if (!myView) {
        // If myView is false, return the total expected revenue and opportunities
        return { value: totalExpectedRevenue, contributingOpportunities };
      }
      console.log("myview is true ------");

      // Step 2: Apply myView filtering
      const myViewResult = await OpportunityMasterModel.aggregate([
        {
          $match: {
            _id: { $in: contributingOpportunities }, // Filter opportunities in range
          },
        },
        {
          $lookup: {
            from: "clientmasters",
            localField: "client",
            foreignField: "_id",
            as: "client",
          },
        },
        { $unwind: "$client" }, // Ensure `client` is populated
        {
          $match: {
            solution: {
              $in: mySolution.map((id) => new mongoose.Types.ObjectId(id)),
            },
            "client.industry": {
              $in: myIndustry.map((id) => new mongoose.Types.ObjectId(id)),
            },
            "client.territory": {
              $in: myTerritory.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalExpectedRevenue: { $sum: "$expectedSales" },
            contributingOpportunities: { $push: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            totalExpectedRevenue: 1,
            contributingOpportunities: 1,
          },
        },
      ]);

      // console.log(" my expected revenue contributing --------", myViewResult[0].contributingOpportunities )

      const filteredRevenue =
        myViewResult.length > 0 ? myViewResult[0].totalExpectedRevenue : 0;
      const filteredOpportunities =
        myViewResult.length > 0
          ? myViewResult[0].contributingOpportunities
          : [];

      // Step 3: Return the appropriate result
      return {
        value: filteredRevenue,
        contributingOpportunities: filteredOpportunities,
      };
    } catch (error) {
      console.error("Error calculating expected revenue:", error);
      throw new Error("Failed to calculate expected revenue.");
    }
  }

  // my view easy
  // static async getActualRevenue(startDate, endDate, myView, mySIT) {
  //   const { mySolution, myIndustry, myTerritory } = mySIT;
  //   try {
  //     // Convert provided string IDs to ObjectId for MongoDB compatibility
  //     const closingStageId = new mongoose.Types.ObjectId(
  //       "670e7df5f5e783c1a47cd499"
  //     );
  //     const wonSubStageId = new mongoose.Types.ObjectId(
  //       "670e81150a2c8e8563f16b55"
  //     );

  //     // Step 1: Find StageHistory documents with the closing stage within the given date range
  //     const wonOpportunities = await StageHistoryModel.aggregate([
  //       {
  //         $match: {
  //           stage: closingStageId,
  //           entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
  //         },
  //       },
  //       // Step 2: Populate subStageHistory and filter those containing the "won" sub-stage within the date range
  //       {
  //         $lookup: {
  //           from: "substagehistories", // Assuming the collection name is 'substagehistories'
  //           localField: "subStageHistory",
  //           foreignField: "_id",
  //           as: "subStageHistoryDetails",
  //         },
  //       },
  //       {
  //         $match: {
  //           "subStageHistoryDetails.subStage": wonSubStageId,
  //           "subStageHistoryDetails.entryDate": {
  //             $gte: new Date(startDate),
  //             $lte: new Date(endDate),
  //           },
  //         },
  //       },
  //       // Collect opportunity IDs for these "won" opportunities
  //       {
  //         $group: {
  //           _id: null,
  //           wonOpportunityIds: { $addToSet: "$opportunity" },
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           wonOpportunityIds: 1,
  //         },
  //       },
  //     ]);

  //     // If no opportunities were won in the period, return 0 for actual revenue and an empty array
  //     if (
  //       !wonOpportunities.length ||
  //       !wonOpportunities[0].wonOpportunityIds.length
  //     ) {
  //       return { value: 0, contributingOpportunities: [] };
  //     }

  //     // Step 3: Calculate the total expectedSales for these "won" opportunities
  //     const actualRevenueResult = await OpportunityMasterModel.aggregate([
  //       {
  //         $match: {
  //           _id: { $in: wonOpportunities[0].wonOpportunityIds },
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: null,
  //           totalActualRevenue: { $sum: "$expectedSales" },
  //           contributingOpportunities: { $push: "$_id" },
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           totalActualRevenue: 1,
  //           contributingOpportunities: 1,
  //         },
  //       },
  //     ]);

  //     return {
  //       value:
  //         actualRevenueResult.length > 0
  //           ? actualRevenueResult[0].totalActualRevenue
  //           : 0,
  //       contributingOpportunities:
  //         actualRevenueResult.length > 0
  //           ? actualRevenueResult[0].contributingOpportunities
  //           : [],
  //     };
  //   } catch (error) {
  //     console.error("Error calculating actual revenue:", error);
  //     throw new Error("Failed to calculate actual revenue.");
  //   }
  // }

  static async getActualRevenue(startDate, endDate, myView, mySIT) {
    const mySolution = mySIT?.mySolution;
    const myIndustry = mySIT?.myIndustry;
    const myTerritory = mySIT?.myTerritory;

    try {
      const closingStageId = new mongoose.Types.ObjectId(
        "670e7df5f5e783c1a47cd499"
      );
      const wonSubStageId = new mongoose.Types.ObjectId(
        "670e81150a2c8e8563f16b55"
      );

      // Step 1: Find StageHistory documents with the closing stage within the given date range
      const wonOpportunities = await StageHistoryModel.aggregate([
        {
          $match: {
            stage: closingStageId,
            entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          },
        },
        {
          $lookup: {
            from: "substagehistories",
            localField: "subStageHistory",
            foreignField: "_id",
            as: "subStageHistoryDetails",
          },
        },
        {
          $match: {
            "subStageHistoryDetails.subStage": wonSubStageId,
            "subStageHistoryDetails.entryDate": {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            wonOpportunityIds: { $addToSet: "$opportunity" },
          },
        },
        {
          $project: {
            _id: 0,
            wonOpportunityIds: 1,
          },
        },
      ]);

      if (
        !wonOpportunities.length ||
        !wonOpportunities[0].wonOpportunityIds.length
      ) {
        return { value: 0, contributingOpportunities: [] };
      }

      const wonOpportunityIds = wonOpportunities[0].wonOpportunityIds;

      // Step 2: Calculate total actual revenue without myView filtering
      const actualRevenueResult = await OpportunityMasterModel.aggregate([
        {
          $match: {
            _id: { $in: wonOpportunityIds },
          },
        },
        {
          $group: {
            _id: null,
            totalActualRevenue: { $sum: "$expectedSales" },
            contributingOpportunities: { $push: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            totalActualRevenue: 1,
            contributingOpportunities: 1,
          },
        },
      ]);

      const totalActualRevenue =
        actualRevenueResult.length > 0
          ? actualRevenueResult[0].totalActualRevenue
          : 0;
      const contributingOpportunities =
        actualRevenueResult.length > 0
          ? actualRevenueResult[0].contributingOpportunities
          : [];
      console.log("myView in actual revenue ---------------", myView);
      if (!myView) {
        // If myView is false, return the total actual revenue and opportunities
        return { value: totalActualRevenue, contributingOpportunities };
      }
      console.log("after--------");
      // Step 3: Apply myView filtering
      const myViewResult = await OpportunityMasterModel.aggregate([
        {
          $match: {
            _id: { $in: wonOpportunityIds }, // Filter opportunities in range
          },
        },
        {
          $lookup: {
            from: "clientmasters",
            localField: "client",
            foreignField: "_id",
            as: "client",
          },
        },
        { $unwind: "$client" },
        {
          $match: {
            solution: {
              $in: mySolution.map((id) => new mongoose.Types.ObjectId(id)),
            },
            "client.industry": {
              $in: myIndustry.map((id) => new mongoose.Types.ObjectId(id)),
            },
            "client.territory": {
              $in: myTerritory.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalActualRevenue: { $sum: "$expectedSales" },
            contributingOpportunities: { $push: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            totalActualRevenue: 1,
            contributingOpportunities: 1,
          },
        },
      ]);

      const filteredRevenue =
        myViewResult.length > 0 ? myViewResult[0].totalActualRevenue : 0;
      const filteredOpportunities =
        myViewResult.length > 0
          ? myViewResult[0].contributingOpportunities
          : [];

      // Step 4: Return the appropriate result
      return {
        value: filteredRevenue,
        contributingOpportunities: filteredOpportunities,
      };
    } catch (error) {
      console.error("Error calculating actual revenue:", error);
      throw new Error("Failed to calculate actual revenue.");
    }
  }

  //myview easy
  // static async getOpenOpportunities(startDate, endDate, myView, mySIT) {
  //   const mySolution = mySIT?.mySolution
  //  const myIndustry = mySIT?.myIndustry
  //  const myTerritory = mySIT?.myTerritory
  //   try {
  //     const openOpportunities = await OpportunityMasterModel.aggregate([
  //       // Match opportunities open within the given date range
  //       {
  //         $match: {
  //           openingDate: { $lte: new Date(endDate) },
  //           $or: [
  //             { closingDate: { $gte: new Date(startDate) } },
  //             { closingDate: null },
  //           ],
  //         },
  //       },
  //       // Get the count and IDs of open opportunities
  //       {
  //         $group: {
  //           _id: null,
  //           value: { $sum: 1 },
  //           contributingOpportunities: { $push: "$_id" },
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           value: 1,
  //           contributingOpportunities: 1,
  //         },
  //       },
  //     ]);

  //     // Return the count and IDs of open opportunities or default values
  //     return openOpportunities.length > 0
  //       ? openOpportunities[0]
  //       : { value: 0, contributingOpportunities: [] };
  //   } catch (error) {
  //     console.error("Error calculating open opportunities:", error);
  //     throw new Error("Failed to calculate open opportunities.");
  //   }
  // }

  static async getOpenOpportunities(startDate, endDate, myView, mySIT) {
    const mySolution = mySIT?.mySolution;
    const myIndustry = mySIT?.myIndustry;
    const myTerritory = mySIT?.myTerritory;

    try {
      // Step 1: Aggregate open opportunities within the specified date range
      const openOpportunities = await OpportunityMasterModel.aggregate([
        {
          $match: {
            openingDate: { $lte: new Date(endDate) }, // Opportunity opens on or before the end date
            $or: [
              { closingDate: { $gte: new Date(endDate) } }, // Opportunity closes after or on the start date
              { closingDate: null }, // Opportunity has no closing date
            ],
          },
        },
        {
          $group: {
            _id: null,
            value: { $sum: 1 }, // Count the number of matching opportunities
            contributingOpportunities: { $push: "$_id" }, // Collect their IDs
          },
        },
        {
          $project: {
            _id: 0,
            value: 1,
            contributingOpportunities: 1,
          },
        },
      ]);
      

      // If no open opportunities exist, return default values
      if (
        !openOpportunities.length ||
        !openOpportunities[0].contributingOpportunities.length
      ) {
        return { value: 0, contributingOpportunities: [] };
      }

      const allOpenOpportunities = openOpportunities[0];
      const openOpportunityIds = allOpenOpportunities?.contributingOpportunities;
      console.log("open opportunity before my view ", openOpportunityIds)
      if (!myView) {
        // If myView is false, return the total open opportunities without filtering
        return allOpenOpportunities;
      }

      // Step 2: Filter open opportunities by mySolution, myIndustry, and myTerritory
      const filteredOpportunities = await OpportunityMasterModel.aggregate([
        {
          $match: {
            _id: { $in: openOpportunityIds }, // Only consider the previously identified open opportunities
          },
        },
        {
          $lookup: {
            from: "clientmasters", // Assuming the collection name for client data is 'clients'
            localField: "client",
            foreignField: "_id",
            as: "client",
          },
        },
        { $unwind: "$client" }, // Unwind the client data for access to its fields
        {
          $match: {
            solution: {
              $in: mySolution.map((id) => new mongoose.Types.ObjectId(id)),
            },
            "client.industry": {
              $in: myIndustry.map((id) => new mongoose.Types.ObjectId(id)),
            },
            "client.territory": {
              $in: myTerritory.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        {
          $group: {
            _id: null,
            value: { $sum: 1 },
            contributingOpportunities: { $push: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            value: 1,
            contributingOpportunities: 1,
          },
        },
      ]);

      // Return the filtered result
      return filteredOpportunities.length > 0
        ? filteredOpportunities[0]
        : { value: 0, contributingOpportunities: [] };
    } catch (error) {
      console.error("Error calculating open opportunities:", error);
      throw new Error("Failed to calculate open opportunities.");
    }
  }

  // my view easy
  // static async getOpportunityWonCount(startDate, endDate) {
  //   try {
  //     // Define the ObjectId for the closing stage and won sub-stage
  //     const closingStageId = new mongoose.Types.ObjectId(
  //       "670e7df5f5e783c1a47cd499"
  //     );
  //     const wonSubStageId = new mongoose.Types.ObjectId(
  //       "670e81150a2c8e8563f16b55"
  //     );

  //     const wonOpportunities = await StageHistoryModel.aggregate([
  //       // First, match all stage history entries for the "closing" stage within the date range
  //       {
  //         $match: {
  //           stage: closingStageId,
  //           entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
  //         },
  //       },
  //       // Populate the sub-stage history to check if the opportunity has the "won" sub-stage
  //       {
  //         $lookup: {
  //           from: "substagehistories", // Collection for SubStageHistory
  //           localField: "subStageHistory",
  //           foreignField: "_id",
  //           as: "subStageHistoryDetails",
  //         },
  //       },
  //       // Filter sub-stages to retain only those with the "won" sub-stage within the date range
  //       {
  //         $match: {
  //           "subStageHistoryDetails.subStage": wonSubStageId,
  //           "subStageHistoryDetails.entryDate": {
  //             $gte: new Date(startDate),
  //             $lte: new Date(endDate),
  //           },
  //         },
  //       },
  //       // Extract unique opportunity IDs from the matching stage history documents
  //       {
  //         $group: {
  //           _id: null,
  //           contributingOpportunities: { $addToSet: "$opportunity" },
  //         },
  //       },
  //       // Project the count of won opportunities and the list of opportunity IDs
  //       {
  //         $project: {
  //           _id: 0,
  //           value: { $size: "$contributingOpportunities" },
  //           contributingOpportunities: "$contributingOpportunities",
  //         },
  //       },
  //     ]);

  //     // Return the count of won opportunities and the array of opportunity IDs
  //     return wonOpportunities.length > 0
  //       ? wonOpportunities[0]
  //       : { count: 0, opportunityIds: [] };
  //   } catch (error) {
  //     console.error("Error calculating won opportunities:", error);
  //     throw new Error("Failed to calculate won opportunities.");
  //   }
  // }

  // static async getOpportunityWonCount(startDate, endDate, myView, mySIT) {
  //   const mySolution = mySIT?.mySolution;
  //   const myIndustry = mySIT?.myIndustry;
  //   const myTerritory = mySIT?.myTerritory;

  //   try {
  //     // Define the ObjectId for the closing stage and won sub-stage
  //     const closingStageId = new mongoose.Types.ObjectId(
  //       "670e7df5f5e783c1a47cd499"
  //     );
  //     const wonSubStageId = new mongoose.Types.ObjectId(
  //       "670e81150a2c8e8563f16b55"
  //     );

  //     // Step 1: Find all opportunities that were won within the date range
  //     const wonOpportunities = await StageHistoryModel.aggregate([
  //       {
  //         $match: {
  //           stage: closingStageId,
  //           entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "substagehistories", // Collection for SubStageHistory
  //           localField: "subStageHistory",
  //           foreignField: "_id",
  //           as: "subStageHistoryDetails",
  //         },
  //       },
  //       {
  //         $match: {
  //           "subStageHistoryDetails.subStage": wonSubStageId,
  //           "subStageHistoryDetails.entryDate": {
  //             $gte: new Date(startDate),
  //             $lte: new Date(endDate),
  //           },
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: null,
  //           contributingOpportunities: { $addToSet: "$opportunity" },
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           value: { $size: "$contributingOpportunities" },
  //           contributingOpportunities: "$contributingOpportunities",
  //         },
  //       },
  //     ]);

  //     // If no won opportunities exist, return default values
  //     if (!wonOpportunities.length || !wonOpportunities[0].contributingOpportunities.length) {
  //       return { count: 0, opportunityIds: [] };
  //     }

  //     const allWonOpportunities = wonOpportunities[0];
  //     const wonOpportunityIds = allWonOpportunities.contributingOpportunities;

  //     if (!myView) {
  //       // If myView is false, return all won opportunities without filtering
  //       return { count: allWonOpportunities.value, opportunityIds: wonOpportunityIds };
  //     }

  //     // Step 2: Apply myView filtering
  //     const filteredOpportunities = await OpportunityMasterModel.aggregate([
  //       {
  //         $match: {
  //           _id: { $in: wonOpportunityIds }, // Only consider the previously identified won opportunities
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "clients", // Collection for clients
  //           localField: "client",
  //           foreignField: "_id",
  //           as: "client",
  //         },
  //       },
  //       { $unwind: "$client" }, // Unwind the client data for filtering
  //       {
  //         $match: {
  //           solution: { $in: mySolution.map((id) => new mongoose.Types.ObjectId(id)) },
  //           "client.industry": { $in: myIndustry.map((id) => new mongoose.Types.ObjectId(id)) },
  //           "client.territory": { $in: myTerritory.map((id) => new mongoose.Types.ObjectId(id)) },
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: null,
  //           value: { $sum: 1 },
  //           contributingOpportunities: { $push: "$_id" },
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           value: 1,
  //           contributingOpportunities: 1,
  //         },
  //       },
  //     ]);

  //     // Return the filtered result
  //     return filteredOpportunities.length > 0
  //       ? { count: filteredOpportunities[0].value, opportunityIds: filteredOpportunities[0].contributingOpportunities }
  //       : { count: 0, opportunityIds: [] };
  //   } catch (error) {
  //     console.error("Error calculating won opportunities:", error);
  //     throw new Error("Failed to calculate won opportunities.");
  //   }
  // }

  static async getOpportunityWonCount(startDate, endDate, myView, mySIT) {
    const mySolution = mySIT?.mySolution;
    const myIndustry = mySIT?.myIndustry;
    const myTerritory = mySIT?.myTerritory;

    try {
      // Define the ObjectId for the closing stage and won sub-stage
      const closingStageId = new mongoose.Types.ObjectId(
        "670e7df5f5e783c1a47cd499"
      );
      const wonSubStageId = new mongoose.Types.ObjectId(
        "670e81150a2c8e8563f16b55"
      );

      // Step 1: Aggregate to find won opportunities
      const wonOpportunities = await StageHistoryModel.aggregate([
        // Match entries in the closing stage within the date range
        {
          $match: {
            stage: closingStageId,
            entryDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          },
        },
        // Lookup details for subStageHistory
        {
          $lookup: {
            from: "substagehistories", // SubStageHistory collection
            localField: "subStageHistory",
            foreignField: "_id",
            as: "subStageHistoryDetails",
          },
        },
        // Unwind the subStageHistoryDetails array to evaluate individual entries
        { $unwind: "$subStageHistoryDetails" },
        // Match entries in the "won" sub-stage within the date range
        {
          $match: {
            "subStageHistoryDetails.subStage": wonSubStageId,
            "subStageHistoryDetails.entryDate": {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        // Group by opportunity ID to ensure each opportunity is counted only once
        {
          $group: {
            _id: "$opportunity",
          },
        },
        // Collect the count of opportunities and their IDs
        {
          $group: {
            _id: null,
            value: { $sum: 1 },
            contributingOpportunities: { $push: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            value: 1,
            contributingOpportunities: 1,
          },
        },
      ]);

      // If no won opportunities exist, return default values
      if (!wonOpportunities.length) {
        return { value: 0, opportunityIds: [] };
      }

      const allWonOpportunities = wonOpportunities[0];
      const wonOpportunityIds = allWonOpportunities.contributingOpportunities;

      if (!myView) {
        // If myView is false, return all won opportunities without filtering
        return {
          value: allWonOpportunities.value,
          opportunityIds: wonOpportunityIds,
        };
      }

      // Step 2: Apply myView filtering
      const filteredOpportunities = await OpportunityMasterModel.aggregate([
        {
          $match: {
            _id: { $in: wonOpportunityIds }, // Only consider previously identified won opportunities
          },
        },
        {
          $lookup: {
            from: "clientmasters", // Client collection
            localField: "client",
            foreignField: "_id",
            as: "client",
          },
        },
        { $unwind: "$client" }, // Unwind the client data for filtering
        {
          $match: {
            solution: {
              $in: mySolution.map((id) => new mongoose.Types.ObjectId(id)),
            },
            "client.industry": {
              $in: myIndustry.map((id) => new mongoose.Types.ObjectId(id)),
            },
            "client.territory": {
              $in: myTerritory.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        {
          $group: {
            _id: null,
            value: { $sum: 1 },
            contributingOpportunities: { $push: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            value: 1,
            contributingOpportunities: 1,
          },
        },
      ]);

      // Return the filtered result
      return filteredOpportunities.length > 0
        ? {
            value: filteredOpportunities[0].value,
            opportunityIds: filteredOpportunities[0].contributingOpportunities,
          }
        : { value: 0, opportunityIds: [] };
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

  static getHeatMapData = async (
    year,
    stageId,
    subStageId,
    filterOptions,
    myView,
    mySIT
  ) => {
    const mySolution = mySIT?.mySolution;
    const myIndustry = mySIT?.myIndustry;
    const myTerritory = mySIT?.myTerritory;
    if (!year || !stageId)
      throw new ClientError(
        "Error in getHearMap",
        errors.HeatMap.ALL_FIELDS_REQUIRED
      );
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const heatmapData = {};

    for (let month = 0; month < 12; month++) {
      const { start, end } = this.getMonthlyRange(year, month);
      const monthName = months[month];

      // Step 1: Get all opportunities that were in the specified stage/sub-stage in this month
      const stageHistoryRecords = await StageHistoryModel.find({
        stage: stageId,
        ...(subStageId ? { "subStageHistory.subStage": subStageId } : {}),
        entryDate: { $lte: end },
        $or: [{ exitDate: null }, { exitDate: { $gte: start } }],
      }).populate({
        path: "opportunity",
        populate: { path: "client" }, // Populate client data for filters
      });

      // Step 2: Extract opportunities from the stage history records
      let opportunitiesInMonth = stageHistoryRecords.map(
        (record) => record.opportunity
      );

      // Step 3: Apply the filter function to opportunities for this month
      const filteredOpportunities = applyFilters(
        opportunitiesInMonth,
        filterOptions
      );

      console.log("My view Heat Map -------------- - ", myView , filteredOpportunities)
      // Optional stage : if myView Filter is Enabled
      if (myView) {
        opportunitiesInMonth = opportunitiesInMonth.filter(
          (opportunity) =>
            mySolution?.includes(opportunity?.solution?.toString()) &&
            myTerritory?.includes(opportunity?.client?.territory.toString()) &&
            myIndustry?.includes(opportunity?.client?.industry?.toString())
        );
      }

      // Step 4: Add the filtered count to the response data
      heatmapData[monthName] = filteredOpportunities.length;
    }

    return heatmapData;
  };

  static getHeatMap = catchAsyncError(async (req, res) => {
    let { year = "2024", stageId, subStageId } = req.body;
    const myView = req.query.myView == "true";
    const mySIT = getMyViewFilter(req.user);
    const filterOptions = getFilterOptions(req.query);
    year = Number(year);
    let heatMapData = {};
    for (let i = year - 2; i <= year; i++) {
      let currentYearData = await this.getHeatMapData(
        i.toString(),
        stageId,
        subStageId,
        filterOptions,
        myView,
        mySIT
      );
      heatMapData[`${i.toString()}`] = currentYearData;
    }
    return res.status(200).json({
      status: "success",
      message: "Heat Map fetched successfully",
      data: heatMapData,
    });
  });
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

  // Ensure `getOpportunityDistribution` uses an arrow function to bind `this`
  static getOpportunityDistribution = async (req, res, endDate) => {
    req.body.particularDate = endDate; // Should work correctly here
    const pipeView = await PipeViewController.generatePipeView(req, res);
    const funnelStats = FunnelViewController.getFunnelStateCount(pipeView);

    return funnelStats;
  };

  static getSummaryView = catchAsyncError(async (req, res) => {
    const myView = req.query.myView == "true";
    console.log("myView------------", myView);
    const mySIT = getMyViewFilter(req.user);

    const { startDate = null, endDate = null } = req.body;
    const fsd = startDate ? new Date(startDate) : new Date("2010-01-01");
    const fed = endDate ? new Date(endDate) : new Date(Date.now());

    const expectedRevenue = await this.getExpectedRevenue(
      fsd,
      fed,
      myView,
      mySIT
    );
    console.log("expected revenue in summary view ");
    console.log("expected revenue in summary view ", expectedRevenue);
    const actualRevenue = await this.getActualRevenue(fsd, fed, myView, mySIT);
    const openOpportunities = await this.getOpenOpportunities(
      fsd,
      fed,
      myView,
      mySIT
    );
    const opportunityWonCount = await this.getOpportunityWonCount(
      fsd,
      fed,
      myView,
      mySIT
    );
    const opportunityDistribution =
      await SummaryViewController.getOpportunityDistribution(req, res, fed);
    console.log(
      "request 2 -------------------------------------------------------"
    );

    await appendCompareStats(
      actualRevenue,
      expectedRevenue,
      openOpportunities,
      opportunityWonCount,
      fsd,
      fed,
      myView,
      mySIT
    );
    console.log("Actual Revenue:", actualRevenue);
    // console.log("Expected Revenue:", expectedRevenue);
    // console.log("Open Opportunities:", openOpportunities);
    // console.log("Opportunity Won Count:", opportunityWonCount);
    // console.log("Opportunity Distribution:", opportunityDistribution);

    return res.send({
      status: "success",
      message: "summary view fetched successfully!",
      data: {
        actualRevenue,
        expectedRevenue,
        openOpportunities,
        opportunityWonCount,
        opportunityDistribution,
      },
    });
  });
}
export default SummaryViewController;
