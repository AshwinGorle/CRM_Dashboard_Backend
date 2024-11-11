const applyFilters = (opportunities, filterOptions) => {
    return opportunities.filter((record) => {
        const { client } = record;
        // console.log("industry array : ", filterOptions?.industry)
        // console.log("opp industry : ", client?.industry)
        // Check if client exists before checking its properties
        const isTerritoryValid = !filterOptions.territory || (client && client.territory && filterOptions.territory.includes(client.territory.toString()));
        const isIndustryValid = !filterOptions.industry || (client && client.industry && filterOptions.industry.includes(client.industry.toString()));
        const isSubIndustryValid = !filterOptions.subIndustry || (client && client.subIndustry && filterOptions.subIndustry.includes(client.subIndustry.toString()));
  
        // Check enteredBy and solution in the main record
        const isEnteredByValid = !filterOptions.enteredBy || (record.enteredBy && filterOptions.enteredBy.includes(record.enteredBy._id.toString()));
        const isSolutionValid = !filterOptions.solution || (record.solution && filterOptions.solution.includes(record.solution.toString()));
        const isSalesChampValid = !filterOptions.salesChamp || (record.salesChamp && filterOptions.salesChamp.includes(record.salesChamp.toString()));
        const isEnteredBy = !filterOptions.enteredBy || (record.enteredBy && filterOptions.enteredBy.includes(record.enteredBy.toString()));
        //console.log("isIndustryValid : ", isIndustryValid);
        //console.log("isSubIndustryValid : ", isSubIndustryValid);
        //console.log("isEnteredByValid : ", isEnteredByValid);
        //console.log("isSolutionValid : ", isSolutionValid);
        //console.log("Filter result : ", isTerritoryValid && isIndustryValid && isSubIndustryValid && isEnteredByValid && isSolutionValid)
        return isTerritoryValid && isIndustryValid && isSubIndustryValid && isEnteredByValid && isSolutionValid && isSalesChampValid && isEnteredBy;
    });
  };

  export default applyFilters