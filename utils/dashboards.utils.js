
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
  fed
) => {

  const { startDate, endDate } = getLastDurationDates(fsd, fed);
  const compareDescription = getLastDurationDescription(startDate, endDate);
  console.log("newStartDate : ",startDate);
  console.log("newEndDate : ",endDate);
  const lastActualRevenue = await SummaryViewController.getActualRevenue(startDate, endDate);
  const lastExpectedRevenue = await SummaryViewController.getExpectedRevenue(startDate, endDate);
  const lastOpenOpportunities = await SummaryViewController.getOpenOpportunities(startDate, endDate);
  const lastOpportunityWonCount = await SummaryViewController.getOpportunityWonCount(startDate, endDate);

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
