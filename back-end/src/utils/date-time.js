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

function lessThanToday(rawDate){
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

module.exports = { dayOfWeek, lessThanToday };
