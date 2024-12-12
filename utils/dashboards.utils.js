
import { getLastDurationDates, getLastDurationDescription } from "./date.utils.js";
import SummaryViewController from "../controllers/Dashboards/SummaryViewController.js";

export const calculatePercentageChange = (currentValue, previousValue = 0) => {
  if (previousValue === 0) {
    //throw new Error("Cannot calculate percentage change when the base value (b) is 0.");
    return 100;
  }
  const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
  return percentageChange;
};

export const appendCompareStats = async (
  actualRevenue,
  expectedRevenue,
  openOpportunities,
  opportunityWonCount,
  fsd,
  fed,
  myView,
  mySIT
) => {

  const { startDate, endDate } = getLastDurationDates(fsd, fed);
  const compareDescription = getLastDurationDescription(startDate, endDate);
  console.log("newStartDate : ",startDate);
  console.log("newEndDate : ",endDate);
  const lastActualRevenue = await SummaryViewController.getActualRevenue(startDate, endDate, myView, mySIT);
  const lastExpectedRevenue = await SummaryViewController.getExpectedRevenue(startDate, endDate, myView, mySIT);
  const lastOpenOpportunities = await SummaryViewController.getOpenOpportunities(startDate, endDate, myView, mySIT);
  const lastOpportunityWonCount = await SummaryViewController.getOpportunityWonCount(startDate, endDate, myView, mySIT);

  const compare = {
    percentage: 0,
    description: compareDescription
  };
  
  console.log("last actual revenue : ", lastActualRevenue);
  console.log("actual : ",actualRevenue.value, " last : ", lastActualRevenue.value)
  compare.percentage = calculatePercentageChange(actualRevenue.value, lastActualRevenue.value);
  console.log("compare percentage ", compare.percentage)
  actualRevenue["compare"] = compare;
  
  compare.percentage = calculatePercentageChange(expectedRevenue.value, lastExpectedRevenue.value);
  expectedRevenue["compare"] = compare;
  
  compare.percentage = calculatePercentageChange(openOpportunities.value, lastOpenOpportunities.value);
  openOpportunities["compare"] = compare;
  
  compare.percentage = calculatePercentageChange(opportunityWonCount.value, lastOpportunityWonCount.value);
  opportunityWonCount["compare"] = compare;

};

export const getMyViewFilter = (user) => {
  const mySolution = user.solution
  const myTerritory = user.territory
  const myIndustry = user.industry
  return { mySolution, myTerritory, myIndustry }
}