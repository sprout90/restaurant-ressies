const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

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

function validDate(dateString){

  try {
    let [ year, month, day ] = rawDate.split("-");
    
    // create the date object with the values sent in (month is zero based)
    const testDate = new Date(year,month-1,day,0,0,0,0);

    // get the month, day, and year from the object we just created 
    const testMonth = testDate.getMonth() + 1;
    const testDay = testDate.getDate();
    const testYear = testDate.getYear() + 1900;

    // if they match then the date is valid
    if ( testMonth == month && testYear == year && testDay == day )
      return true; 
    else
      return false;

  } catch (error) {
      return false;
  }

}

/**
 * Format a date string in ISO-8601 format (which is what is returned from PostgreSQL) as YYYY-MM-DD.
 * @param dateString
 *  ISO-8601 date string
 * @returns {*}
 *  the specified date string formatted as YYYY-MM-DD
 */
export function formatAsDate(dateString) {
  return dateString.match(dateFormat)[0];
}

/**
 * Format a time string in HH:MM:SS format (which is what is returned from PostgreSQL) as HH:MM.
 * @param timeString
 *  HH:MM:SS time string
 * @returns {*}
 *  the specified time string formatted as YHH:MM.
 */
export function formatAsTime(timeString) {
  return timeString.match(timeFormat)[0];
}

/**
 * Today's date as YYYY-MM-DD.
 * @returns {*}
 *  the today's date formatted as YYYY-MM-DD
 */
export function today() {
  return asDateString(new Date());
}

/**
 * Return day of week (i.e., Wednesday) for rawDate parameter.
 * must subract 1 from month to convert value from Javascript month.
 * @param rawDate 
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the day of week that this date presents.
 */
export function dayOfWeek(rawDate){
  let [ year, month, day ] = rawDate.split("-");
  const date = new Date(year, month-1, day)
  const dow = date.toLocaleString('en-us', {  weekday: 'long' });
  return dow;
}

/**
 * Subtracts one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day prior to currentDate, formatted as YYYY-MM-DD
 */
export function previous(currentDate) {
  let [ year, month, day ] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setMonth(date.getMonth());
  date.setDate(date.getDate() - 1);
  return asDateString(date);
}

/**
 * Adds one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day after currentDate, formatted as YYYY-MM-DD
 */
export function next(currentDate) {
  let [ year, month, day ] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setMonth(date.getMonth());
  date.setDate(date.getDate() + 1);
  return asDateString(date);
}

/**
 * Determines if in the input date (rawDate) is less than today
 * @param rawDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  true or false, whether the input date is less than today.
 */
export function lessThanToday(rawDate){
  let [ year, month, day ] = rawDate.split("-");
  month -= 1;
  const pickDate = new Date(year, month, day);
  const today = new Date()
  if (pickDate.getTime() < today.getTime()){
    return true
  } else {
    return false;
  }
}

/**
 * Determines if in the input date (rawDate) is less than today
 * @param rawDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @param rawTime
 *  a time string in HH:MM format
 * @returns {*}
 *  true or false, whether the input date & time is less than current date, and time
 */
export function lessThanNow(rawDate, rawTime){
 
  const pickDate = new Date(rawDate + " " + rawTime);
  const today = new Date()
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
export function lessThanDefinedTime(timeA, timeB){
 
  timeA = as24HourTime(timeA);
  console.log("time A ", timeA)
  const pickTime = new Date("1990-01-01 " + timeA);
  const comparedTime = new Date("1990-01-01 " + timeB);
  console.log("input and compare times ", pickTime, comparedTime)
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
export function greaterThanDefinedTime(timeA, timeB){
 
  timeA = as24HourTime(timeA);
  console.log("time A ", timeA)
  const pickTime = new Date("1990-01-01 " + timeA);
  const comparedTime = new Date("1990-01-01 " + timeB);
  console.log("input and compare times ", pickTime, comparedTime)
  if (pickTime.getTime() > comparedTime.getTime()){
    return true
  } else {
    return false;
  }
}
