


import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";
import { getFilterOptions } from "../../utils/searchOptions.js";
import applyFilters from "../../utils/applyFilters.js";
import mongoose from "mongoose";
import { myViewFilter } from "../../utils/date.utils.js";
class PipeViewController {
  static generatePipeView = async(req, res, next)=>{
    const myView = req.query.myView == "true"
  
    const filterOptions =  getFilterOptions(req?.query);
    // console.log("filter", filterOptions);

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
      
      // for my view implementation
      console.log("My view  : ", myView)
      if( !myView || myViewFilter(req.user,opportunity)){
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
      }
    });

    // Apply filters to each stage array
    pipeView.lead = applyFilters(pipeView.lead, filterOptions);
    pipeView.prospect = applyFilters(pipeView.prospect, filterOptions);
    pipeView.qualification = applyFilters(pipeView.qualification, filterOptions);
    pipeView.proposal = applyFilters(pipeView.proposal, filterOptions);
    pipeView.followup = applyFilters(pipeView.followup, filterOptions);
    pipeView.closing = applyFilters(pipeView.closing, filterOptions);
    return pipeView;
  }

  static getPipeView = catchAsyncError(async (req, res, next) => {
    console.log("pipe view");

    // Get the filter options from query parameters
    const pipeView = await this.generatePipeView(req, res, next);
    // console.log("Final results : ", pipeView);
    // Return the pipe view
    res.status(200).json({
      status: "success",
      message: "Pipe view retrieved successfully",
      data: pipeView
    });
  });
}

export default PipeViewController;
