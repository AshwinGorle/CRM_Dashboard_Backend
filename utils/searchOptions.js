export const getFilterOptions = (query)=>{
  const {territory, subIndustry, industry, enteredBy, client, solution} =  query;
  console.log("territory : ", territory)
  console.log("industry : , ",industry)
  console.log("subIndustry ; ",subIndustry)
  console.log("solution ; ",solution)
  let filterOptions = {};
  if(territory && territory != ""){
    filterOptions.territory = territory;
  }
  if(subIndustry && subIndustry != ""){
    filterOptions.subIndustry = subIndustry;
  }
  if(industry && industry != ""){
    filterOptions.industry = industry;
  }
  if(solution && solution != ""){
    filterOptions.solution = solution;
  }
  if(enteredBy && enteredBy != ""){
    filterOptions.enteredBy = enteredBy
  }
  if(client && client != ""){
    filterOptions.client = client
  }
  return filterOptions;
}

export const getSortingOptions = (query)=>{
  const {name, entry_date} = query
  console.log("getSortingOptions : ", name, entry_date )
  let sortingOptions = {entryDate : -1}
  if(name){
    if(name == '1')
      sortingOptions.name = 1;
    if(name == '-1')
      sortingOptions.name = -1;
  }
  if(entry_date && entry_date != ''){
    if(entry_date == "1")
      sortingOptions.entryDate = 1;
    if(entry_date == "-1")
      sortingOptions.entryDate = -1;
  }
  return sortingOptions
}
