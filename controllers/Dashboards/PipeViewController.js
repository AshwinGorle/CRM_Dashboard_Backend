// import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
// import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
// import OpportunityMasterModel from "../../models/OpportunityMasterModel.js";
// class PipeViewController {
//   static getPipeView = catchAsyncError(async (req, res, next) => {
//     console.log("pipe view")
//     const { particularDate } = req.body; // Expected to be a timestamp
//     if (!particularDate) throw new Error("Particular date is required.");
//     const targetDate = new Date(particularDate);

//     // Define the stages for response
//     const pipeView = {
//       lead: [],
//       prospect: [],
//       qualification: [],
//       proposal: [],
//       followup: [],
//       closing: []
//     };

//     // Query the StageHistoryModel for opportunities active on the given date
//     const opportunitiesInStages = await StageHistoryModel.aggregate([
//       {
//         $match: {
//           $and: [
//             { entryDate: { $lte: targetDate } }, // Entered the stage on or before the target date
//             {
//               $or: [
//                 { exitDate: { $gt: targetDate } }, // Hasn't exited yet or exited after the target date
//                 { exitDate: { $eq: null } }        // Still in the stage (exitDate is null)
//               ]
//             }
//           ]
//         }
//       },
//       {
//         $lookup: {
//           from: "opportunitymasters", // Assuming the collection name is 'opportunitymastermodels'
//           localField: "opportunity",
//           foreignField: "_id",
//           as: "opportunityDetails"
//         }
//       },
//       { $unwind: "$opportunityDetails" }, // Deconstruct the opportunityDetails array
//       {
//         $lookup: {
//           from: "salesstages", // Assuming the collection name is 'salesstagemodels'
//           localField: "stage",
//           foreignField: "_id",
//           as: "stageDetails"
//         }
//       },
//       { $unwind: "$stageDetails" }, // Deconstruct the stageDetails array
//       { $sort: { "stageDetails.level": -1 } }, // Sort by stage level in descending order
//       {
//         $group: {
//           _id: "$opportunity", // Group by opportunity to remove duplicates
//           stage: { $first: "$stageDetails" }, // Pick the stage with the highest level
//           opportunity: { $first: "$opportunityDetails" } // Pick the corresponding opportunity details
//         }
//       }
//     ]);
//     // const opportunitiesInStages = await StageHistoryModel.aggregate([
//     //   {
//     //     $match: {
//     //       $and: [
//     //         { entryDate: { $lte: targetDate } }, // Entered the stage on or before the target date
//     //         {
//     //           $or: [
//     //             { exitDate: { $gt: targetDate } }, // Hasn't exited yet or exited after the target date
//     //             { exitDate: { $eq: null } }        // Still in the stage (exitDate is null)
//     //           ]
//     //         }
//     //       ]
//     //     }
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "opportunitymasters", // Assuming the collection name is 'opportunitymasters'
//     //       localField: "opportunity",
//     //       foreignField: "_id",
//     //       as: "opportunityDetails"
//     //     }
//     //   },
//     //   { $unwind: "$opportunityDetails" }, // Deconstruct the opportunityDetails array
//     //   {
//     //     $lookup: {
//     //       from: "salesstages", // Assuming the collection name is 'salesstages'
//     //       localField: "stage",
//     //       foreignField: "_id",
//     //       as: "stageDetails"
//     //     }
//     //   },
//     //   { $unwind: "$stageDetails" }, // Deconstruct the stageDetails array
      
//     //   // Additional lookup to populate client details
//     //   {
//     //     $lookup: {
//     //       from: "clientmasters", // Assuming the collection name is 'clientmasters'
//     //       localField: "opportunityDetails.client", // The 'client' field inside the opportunity details
//     //       foreignField: "_id", // _id field of the ClientMaster model
//     //       as: "clientDetails"
//     //     }
//     //   },
//     //   { $unwind: { path: "$clientDetails", preserveNullAndEmptyArrays: true } }, // Unwind the clientDetails array
    
//     //   { $sort: { "stageDetails.level": -1 } }, // Sort by stage level in descending order
      
//     //   {
//     //     $group: {
//     //       _id: "$opportunity", // Group by opportunity to remove duplicates
//     //       stage: { $first: "$stageDetails" }, // Pick the stage with the highest level
//     //       opportunity: { $first: "$opportunityDetails" }, // Pick the corresponding opportunity details
//     //       client: { $first: "$clientDetails" } // Include the client details
//     //     }
//     //   },
//     //   {
//     //     $project: {
//     //       _id: 1,
//     //       "opportunity.projectName": 1, // Include any fields you want in the final response
//     //       "opportunity.solution": 1,
//     //       "opportunity.subSolution": 1,
//     //       "opportunity.salesChamp": 1,
//     //       "opportunity.salesStage": 1,
//     //       "opportunity.salesSubStage": 1,
//     //       "opportunity.stageClarification": 1,
//     //       "opportunity.salesTopLine": 1,
//     //       "opportunity.offsets": 1,
//     //       "opportunity.totalRevenue": 1,
//     //       "opportunity.confidenceLevel": 1,
//     //       "opportunity.expectedSales": 1,
//     //       "opportunity.revenue": 1,
//     //       client: { // Include the client fields
//     //         _id: 1,
//     //         name: 1,
//     //         industry: 1
//     //       },
//     //       stage: 1 // Include stage details
//     //     }
//     //   }
//     // ]);
    
    
//     // Iterate through the results and map them to the corresponding stages
//     opportunitiesInStages.forEach((record) => {
//       const { stage, opportunity } = record;
//       switch (stage.label.toLowerCase()) {
//         case "lead":
//           pipeView.lead.push(opportunity);
//           break;
//         case "prospecting":
//           pipeView.prospect.push(opportunity);
//           break;
//         case "qualification":
//           pipeView.qualification.push(opportunity);
//           break;
//         case "proposal":
//           pipeView.proposal.push(opportunity);
//           break;
//         case "followup":
//           pipeView.followup.push(opportunity);
//           break;
//         case "closing":
//           pipeView.closing.push(opportunity);
//           break;
//         default:
//           break;
//       }
//     });

//     // Return the pipe view
//     res.status(200).json({
//       status: "success",
//       message: "Pipe view retrieved successfully",
//       data: pipeView
//     });
//   });
// }

// export default PipeViewController;


import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
import { getFilterOptions } from "../../utils/searchOptions.js";

class PipeViewController {

  static generatePipeView = async(req, res, next)=>{
    const filterOptions =  getFilterOptions(req.query);
    console.log("filter", filterOptions);

    const { particularDate } = req.body; // Expected to be a timestamp
    if (!particularDate) throw new Error("Particular date is required.");
    const targetDate = new Date(particularDate);

    // Define the stages for response
    const pipeView = {
      lead: [],
      prospect: [],
      qualification: [],
      proposal: [],
      followup: [],
      closing: []
    };

    // Query the StageHistoryModel for opportunities active on the given date
    const opportunitiesInStages = await StageHistoryModel.aggregate([
      {
        $match: {
          $and: [
            { entryDate: { $lte: targetDate } }, // Entered the stage on or before the target date
            {
              $or: [
                { exitDate: { $gt: targetDate } }, // Hasn't exited yet or exited after the target date
                { exitDate: { $eq: null } }        // Still in the stage (exitDate is null)
              ]
            }
          ]
        }
      },
      {
        $lookup: {
          from: "opportunitymasters", // Assuming the collection name is 'opportunitymasters'
          localField: "opportunity",
          foreignField: "_id",
          as: "opportunityDetails"
        }
      },
      { $unwind: "$opportunityDetails" }, // Deconstruct the opportunityDetails array

      // Lookup to populate client details
      {
        $lookup: {
          from: "clientmasters", // Assuming the collection name is 'clientmasters'
          localField: "opportunityDetails.client", // The 'client' field inside the opportunity details
          foreignField: "_id", // _id field of the ClientMaster model
          as: "clientDetails"
        }
      },
      { $unwind: { path: "$clientDetails", preserveNullAndEmptyArrays: true } }, // Unwind clientDetails array

      {
        $lookup: {
          from: "salesstages", // Assuming the collection name is 'salesstages'
          localField: "stage",
          foreignField: "_id",
          as: "stageDetails"
        }
      },
      { $unwind: "$stageDetails" }, // Deconstruct the stageDetails array

      // Lookup to populate enteredBy details
      {
        $lookup: {
          from: "users", // Assuming the collection name is 'users'
          localField: "opportunityDetails.enteredBy", // The 'enteredBy' field inside the opportunity details
          foreignField: "_id", // _id field of the User model
          as: "enteredByDetails"
        }
      },
      { $unwind: { path: "$enteredByDetails", preserveNullAndEmptyArrays: true } }, // Unwind enteredByDetails array

      { $sort: { "stageDetails.level": -1 } }, // Sort by stage level in descending order

      {
        $group: {
          _id: "$opportunity", // Group by opportunity to remove duplicates
          stage: { $first: "$stageDetails" }, // Pick the stage with the highest level
          opportunity: { $first: "$opportunityDetails" }, // Pick the corresponding opportunity details
          client: { $first: "$clientDetails" }, // Include the client details
          enteredBy: { $first: "$enteredByDetails" } // Include the enteredBy details
        }
      }
    ]);

    // Helper function to filter opportunities based on criteria
    // Apply filter logic
// Apply filter logic
const applyFilters = (opportunities) => {
  return opportunities.filter((record) => {
      const { client } = record;
      console.log("industry array : ", filterOptions?.industry)
      console.log("opp industry : ", client?.industry)
      // Check if client exists before checking its properties
      const isTerritoryValid = !filterOptions.territory || (client && client.territory && filterOptions.territory.includes(client.territory.toString()));
      const isIndustryValid = !filterOptions.industry || (client && client.industry && filterOptions.industry.includes(client.industry.toString()));
      const isSubIndustryValid = !filterOptions.subIndustry || (client && client.subIndustry && filterOptions.subIndustry.includes(client.subIndustry.toString()));

      // Check enteredBy and solution in the main record
      const isEnteredByValid = !filterOptions.enteredBy || (record.enteredBy && filterOptions.enteredBy.includes(record.enteredBy._id.toString()));
      const isSolutionValid = !filterOptions.solution || (solution && filterOptions.solution.includes(record.solution.toString()));
      console.log("isIndustryValid : ", isIndustryValid);
      console.log("isSubIndustryValid : ", isSubIndustryValid);
      console.log("isEnteredByValid : ", isEnteredByValid);
      console.log("isSolutionValid : ", isSolutionValid);
      console.log("Filter result : ", isTerritoryValid && isIndustryValid && isSubIndustryValid && isEnteredByValid && isSolutionValid)
      return isTerritoryValid && isIndustryValid && isSubIndustryValid && isEnteredByValid && isSolutionValid;
  });
};



    // Iterate through results and map them to corresponding stages
    opportunitiesInStages.forEach((record) => {
      const { stage, opportunity, client, enteredBy } = record;

      // Attach client and enteredBy details to the opportunity
      opportunity.client = client;
      opportunity.enteredBy = {
        avatar: enteredBy?.avatar,
        firstName: enteredBy?.firstName,
        lastName: enteredBy?.lastName,
        _id : enteredBy?._id,
      };

      switch (stage.label.toLowerCase()) {
        case "lead":
          pipeView.lead.push(opportunity);
          break;
        case "prospecting":
          pipeView.prospect.push(opportunity);
          break;
        case "qualification":
          pipeView.qualification.push(opportunity);
          break;
        case "proposal":
          pipeView.proposal.push(opportunity);
          break;
        case "followup":
          pipeView.followup.push(opportunity);
          break;
        case "closing":
          pipeView.closing.push(opportunity);
          break;
        default:
          break;
      }
    });

    // Apply filters to each stage array
    pipeView.lead = applyFilters(pipeView.lead);
    pipeView.prospect = applyFilters(pipeView.prospect);
    pipeView.qualification = applyFilters(pipeView.qualification);
    pipeView.proposal = applyFilters(pipeView.proposal);
    pipeView.followup = applyFilters(pipeView.followup);
    pipeView.closing = applyFilters(pipeView.closing);
    
    return pipeView;

  }

  static getPipeView = catchAsyncError(async (req, res, next) => {
    console.log("pipe view");

    // Get the filter options from query parameters
    const pipeView = await this.generatePipeView(req, res, next);
    console.log("Final results : ", pipeView);
    // Return the pipe view
    res.status(200).json({
      status: "success",
      message: "Pipe view retrieved successfully",
      data: pipeView
    });
  });
}

export default PipeViewController;
