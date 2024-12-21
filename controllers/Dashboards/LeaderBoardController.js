import { catchAsyncError } from "../../middlewares/catchAsyncError.middleware.js";
import { getQuarterDetails } from "../../utils/date.utils.js";
import UserModel from "../../models/UserModel.js";
import ClientMasterModel from "../../models/ClientMasterModel.js";
import ContactMasterModel from "../../models/ContactMasterModel.js";
import RegistrationMasterModel from "../../models/RegistrationMasterModel.js";
import TenderMasterModel from "../../models/TenderMasterModel.js";
import BusinessDevelopmentModel from "../../models/BusinessDevelopmentModel.js";
import SalesStageModel from "../../models/StageModels/SalesStageModel.js";
import StageHistoryModel from "../../models/HistoryModels/StageHistoryModel.js";

class LeaderBoardController {
  // Helper function to create an empty structure for stage counts
  static createEmptyStageCounts = () => ({
    leadEntries: 0,
    prospectEntries: 0,
    qualificationEntries: 0,
    proposalEntries: 0,
    followUpEntries: 0,
    closingEntries: 0,
  });

  // Helper function to determine which time range a date falls into
  static determineTimeRange = (date, quarters) => {
    if (
      date >= new Date(quarters.currentQuarter.startDate) &&
      date <= new Date(quarters.currentQuarter.endDate)
    ) {
      return "currentQuarter";
    } else if (
      date >= new Date(quarters.lastQuarter.startDate) &&
      date <= new Date(quarters.lastQuarter.endDate)
    ) {
      return "lastQuarter";
    } else if (
      date >= new Date(quarters.last3rdQuarter.startDate) &&
      date <= new Date(quarters.last3rdQuarter.endDate)
    ) {
      return "last3rdQuarter";
    } else if (
      date >= new Date(quarters.last4thQuarter.startDate) &&
      date <= new Date(quarters.last4thQuarter.endDate)
    ) {
      return "last4thQuarter";
    } else if (
      date >= new Date(quarters.lastYear.startDate) &&
      date <= new Date(quarters.lastYear.endDate)
    ) {
      return "lastYear";
    }
    return null;
  };

  static getSalesStageEntriesData = async (currentDate, quarters) => {
    // Step 1: Fetch quarter details and all sales stages
    // const quarters = getQuarterDetails(currentDate);
    const allSalesStages = await SalesStageModel.find({}); // Sorted by level
    // Step 2: Fetch all relevant stage histories from the database
    const requiredHistories = await StageHistoryModel.find({
      entryDate: {
        $gte: new Date(quarters.lastYear.startDate),
        $lte: new Date(quarters.currentQuarter.endDate),
      },
    })
      .populate({
        path: "stage",
        select: "_id label",
      })
      .populate({
        path: "opportunity",
        select: "_id projectName enteredBy",
        populate: {
          path: "enteredBy",
          select: "_id firstName lastName",
        },
      })
      .lean();

    // Step 3: Initialize data structure for all sales champs
    const salesChampsMap = {};

    requiredHistories.forEach((history) => {
      const salesChampId = history.opportunity.enteredBy._id;

      // Initialize entry structure for this sales champ if not already done
      if (!salesChampsMap[salesChampId]) {
        salesChampsMap[salesChampId] = {
          _id: salesChampId,
          firstName: history.opportunity.enteredBy.firstName,
          lastName: history.opportunity.enteredBy.lastName,
          entryDetails: {
            currentQuarter: this.createEmptyStageCounts(),
            lastQuarter: this.createEmptyStageCounts(),
            last3rdQuarter: this.createEmptyStageCounts(),
            last4thQuarter: this.createEmptyStageCounts(),
            lastYear: this.createEmptyStageCounts(),
          },
        };
      }

      // Determine which time range this history falls into
      const timeRange = this.determineTimeRange(history.entryDate, quarters);

      if (timeRange) {
        const stageLabel = history.stage.label;
        const stageIndex = allSalesStages.findIndex(
          (stage) => stage.label === stageLabel
        );

        if (stageIndex >= 0) {
          const fieldNames = [
            "leadEntries",
            "prospectEntries",
            "qualificationEntries",
            "proposalEntries",
            "followUpEntries",
            "closingEntries",
          ];
          const fieldName = fieldNames[stageIndex];

          salesChampsMap[salesChampId].entryDetails[timeRange][fieldName]++;
        }
      }
    });

    // Convert the salesChampsMap to an array for the final result
    const result = Object.values(salesChampsMap);
    return result;
  };

  static getModalEntriesData = async (currentDate, quarters) => {
    // Fetch all sales champs
    const salesChamps = await UserModel.find(
      {},
      "_id firstName lastName"
    ).lean();

    // Aggregate data for each sales champ
    const leaderboard = await Promise.all(
      salesChamps.map(async (salesChamp) => {
        const { _id, firstName, lastName } = salesChamp;

        // Helper function to calculate entries for a given time range
        const calculateEntries = async (startDate, endDate) => {
          const filters = {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
            enteredBy: _id,
          };

          const clientEntries = await ClientMasterModel.countDocuments(filters);
          const contactEntries = await ContactMasterModel.countDocuments(
            filters
          );
          const registrationEntries =
            await RegistrationMasterModel.countDocuments(filters);
          const tenderEntries = await TenderMasterModel.countDocuments(filters);
          const businessDevelopmentEntries =
            await BusinessDevelopmentModel.countDocuments(filters);

          return {
            clientEntries,
            contactEntries,
            registrationEntries,
            tenderEntries,
            businessDevelopmentEntries,
          };
        };

        // Calculate entries for each quarter and year
        const entryDetails = {
          currentQuarter: await calculateEntries(
            quarters.currentQuarter.startDate,
            quarters.currentQuarter.endDate
          ),
          lastQuarter: await calculateEntries(
            quarters.lastQuarter.startDate,
            quarters.lastQuarter.endDate
          ),
          last3rdQuarter: await calculateEntries(
            quarters.last3rdQuarter.startDate,
            quarters.last3rdQuarter.endDate
          ),
          last4thQuarter: await calculateEntries(
            quarters.last4thQuarter.startDate,
            quarters.last4thQuarter.endDate
          ),
          lastYear: await calculateEntries(
            quarters.lastYear.startDate,
            quarters.lastYear.endDate
          ),
        };

        // Return sales champ data with entry details
        return {
          _id,
          firstName,
          lastName,
          entryDetails,
        };
      })
    );

    return leaderboard;
  };

  static getLeaderBoard = catchAsyncError(async (req, res)=>{
       const currentDate = new Date(Date.now());
       const quarters = getQuarterDetails(currentDate);
       const stageEntriesData = await this.getSalesStageEntriesData(currentDate, quarters);
       const modalEntriesData = await this.getModalEntriesData(currentDate, quarters);

       
       stageEntriesData.forEach((sEntry)=>{
        console.log("examin--------")
         const indexInModalEntries = modalEntriesData.findIndex((mEntry)=> mEntry._id.toString() === sEntry._id.toString())
        //  const indexInModalEntries = 0;
         console.log("index ----- ",  indexInModalEntries)
         if(indexInModalEntries >= 0){
           modalEntriesData[indexInModalEntries].entryDetails.currentQuarter = {...modalEntriesData[indexInModalEntries].entryDetails.currentQuarter, ...sEntry.entryDetails.currentQuarter}
           modalEntriesData[indexInModalEntries].entryDetails.lastQuarter = {...modalEntriesData[indexInModalEntries].entryDetails.lastQuarter, ...sEntry.entryDetails.lastQuarter}
           modalEntriesData[indexInModalEntries].entryDetails.last3rdQuarter = {...modalEntriesData[indexInModalEntries].entryDetails.last3rdQuarter, ...sEntry.entryDetails.last3rdQuarter}
           modalEntriesData[indexInModalEntries].entryDetails.last4thQuarter = {...modalEntriesData[indexInModalEntries].entryDetails.currentQuarter, ...sEntry.entryDetails.last4thQuarter}
           modalEntriesData[indexInModalEntries].entryDetails.lastYear = {...modalEntriesData[indexInModalEntries].entryDetails.lastYear, ...sEntry.entryDetails.lastYear}
          }
        })

        // return res.send({status : "success", message : "leader board fetched successfully", data : modalEntriesData});
        return res.send({status : "success", message : "leader board fetched successfully", data : {modal : modalEntriesData, stage : stageEntriesData}});
  })
}

export default LeaderBoardController;
