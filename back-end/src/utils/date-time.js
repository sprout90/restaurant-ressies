
/**
 * Returns input time (AM/PM) as 24 hour time.  
 *
 * This function is *not* exported because the UI should generally avoid working directly with time operations
 * You may export this function if you need it.
 *
 * @param date
 *  a string representing time in either 24-hour or meridiem time formats
 * @returns {string}
 *  the specified time in 24-hour format
 */
function as24HourTime(time){

  const postMeridiem = time.indexOf("PM");
  const anteMeridiem = time.indexOf("AM");

  // test if string is already in 24 hour time
  if ((postMeridiem === -1) && (anteMeridiem === -1)){
    return time;
  } else {
    const hours = time.substr(0, 2);
    const minutes = time.substr(3,2);
    if (postMeridiem > -1 ){
      const hours24 = String.toString(parseInt(hours) + 12); 
      const as24Hours = `${hours24}:${minutes}`
      return as24Hours
    } else {
      const as24Hours = `${hours}:${minutes}`
      return as24Hours
    }
  }

}


/**
 * Return day of week (i.e., Wednesday) for rawDate parameter.
 * must subract 1 from month to convert value from Javascript month.
 * @param rawDate 
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the day of week that this date presents.
 */
function dayOfWeek(rawDate){
  let [ year, month, day ] = rawDate.split("-");
  const date = new Date(year, month-1, day)
  const dow = date.toLocaleString('en-us', {  weekday: 'long' });
  return dow;
}

function lessThanToday(rawDate, rawTime){

  // get selected date and time and create date object
  let [ year, month, day ] = rawDate.split("-");
  month -= 1;
  const convertedTime = as24HourTime(rawTime);
  let [ hour, minute] = convertedTime.split(":")
  const pickDate = new Date(year, month, day, hour, minute);

  // get today's date object
  const today = new Date()

  // compare user selected date/time with today's
  if (pickDate.getTime() < today.getTime()){
    return true
  } else {
    return false;
  }
}

/**
 * Determines if in the timeA is less than timeB
 * @param timeA
 *  a time string in HH:MM format from user input
 * @param timeB
 *  a time string in HH:MM format from env variable
 * @returns {*}
 *  true or false, whether the time is less than compare time.
 */
function lessThanDefinedTime(timeA, timeB){
 
  timeA = as24HourTime(timeA);
  const pickTime = new Date("1990-01-01 " + timeA);
  const comparedTime = new Date("1990-01-01 " + timeB);
  if (pickTime.getTime() < comparedTime.getTime()){
    return true
  } else {
    return false;
  }
}

/**
 * Determines if in the timeA is greater than timeB
 * @param timeA
 *  a time string in HH:MM format
 * @param timeB
 *  a time string in HH:MM format
 * @returns {*}
 *  true or false, whether the time is greater than compare time.
 */
function greaterThanDefinedTime(timeA, timeB){
 
  timeA = as24HourTime(timeA);
  const pickTime = new Date("1990-01-01 " + timeA);
  const comparedTime = new Date("1990-01-01 " + timeB);
  if (pickTime.getTime() > comparedTime.getTime()){
    return true
  } else {
    return false;
  }
}


module.exports = { dayOfWeek, lessThanToday, lessThanDefinedTime, greaterThanDefinedTime};
