import { Router } from "express";
import SummaryViewController from "../../controllers/Dashboards/SummaryViewController.js";
const summaryViewRouter = Router();
import checkPermissions from "../../middlewares/checkPermission.js";
import { actionTypes } from "../../config/actionTypes.js";

const entity = "SUMMARY VIEW";
summaryViewRouter.post(
  "/",
  checkPermissions(entity, actionTypes.ALL_VIEW),
  SummaryViewController.getSummaryView
);
summaryViewRouter.post(
  "/heat-map",
  checkPermissions(entity, actionTypes.ALL_VIEW),
  SummaryViewController.getHeatMap
);

export default summaryViewRouter;

// const obj = [{
//    // this is object for one sales champ similar to this you have to calculate for all the saleschamps in the system and push them in this array
//   firstName: "firstName", // name of saleschamp whoes entry details in different modals we are showing
//   lastName: "last name",
//   _id: "here mongoose id", // id of this salesChamp
//   entryDetails: {
//     currentQuarter: {
//       clientEntries:
//         "in integer number how  many entry is done in client document by this sales champ in current Quarter",
//       contactEntries: " same as above for contact",
//       registrationEntries: " same as above for registration",
//       tenderEntries: "same for tender entries",
//       businessDevelopmentEntries: "same for business Development ",
//     },
//     lastQuarter: {
//       clientEntries:
//         "in integer number how  many entry is done in client document by this sales champ in last Quarter",
//       contactEntries: " same as above for contact",
//       registrationEntries: " same as above for registration",
//       tenderEntries: "same for tender entries",
//       businessDevelopmentEntries: "same for business Development ",
//     },
//     last3rdQuarter: {
//       clientEntries:
//         "in integer number how  many entry is done in client document by this sales champ in last 3rd Quarter",
//       contactEntries: " same as above for contact",
//       registrationEntries: " same as above for registration",
//       tenderEntries: "same for tender entries",
//       businessDevelopmentEntries: "same for business Development ",
//     },
//     last4rdQuarter: {
//       clientEntries:
//         "in integer number how  many entry is done in client document by this sales champ in last 4rd Quarter",
//       contactEntries: " same as above for contact",
//       registrationEntries: " same as above for registration",
//       tenderEntries: "same for tender entries",
//       businessDevelopmentEntries: "same for business Development ",
//     },
//     lastYear: {
//       clientEntries:
//         "in integer number how  many entry is done in client document by this sales champ in last year",
//       contactEntries: " same as above for contact",
//       registrationEntries: " same as above for registration",
//       tenderEntries: "same for tender entries",
//       businessDevelopmentEntries: "same for business Development ",
//     },
//   },
// }];
