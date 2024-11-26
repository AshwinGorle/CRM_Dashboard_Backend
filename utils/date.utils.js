export const formatDurationInShort = (days, prefix) => {
    let dateDescription = ""; 
    if (days >= 365) {
      const years = days / 365;
      dateDescription = years.toFixed(years % 1 === 0 ? 0 : 1) + "y"; // "1y" or "2.1y"
    } else if (days >= 30) {
      const months = days / 30;
      dateDescription = Math.round(months) + "m"; // "13m"
    } else {
        dateDescription = days + "d"; // Fallback for small durations
    }
    return  prefix + " " + dateDescription;
  }

  export const getLastDurationDescription = (startDate, endDate) =>{
    const diffInMS = endDate - startDate;
    const days = Math.floor(diffInMS / (1000 * 60 * 60 * 24));
    const durationDescription = formatDurationInShort(days, "Compare with last"); // compare with last 1m or 1y etc
    return durationDescription;
  }
  
  export const getLastDurationDates = (startDate, endDate) => {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      throw new Error("Both startDate and endDate must be Date objects");
    }
    const duration = endDate - startDate; // Get the duration in milliseconds
    const newEndDate = new Date(startDate); // Previous period's end date is the current start date
    const newStartDate = new Date(startDate.getTime() - duration); // Calculate previous period's start date
  
    return { startDate: newStartDate, endDate: newEndDate };
  };
  