const knex = require("../db/connection");
require("dotenv").config();

async function list(queryDate){
    return knex("reservations")
    .select("*")
    .where({"reservation_date": queryDate})
    .orderBy("reservation_date", "asc")
    .orderBy("reservation_time", "asc")
}

async function read(reservationId){

  return knex("reservations")
  .select("*")
  .where({"reservation_id": reservationId})
  .first();
}

async function create(newReservation){

  await knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0])

}

async function update(updatedReservation){
  await knex("reservations")
  .select("*")
  .where({"reservation_id": updatedReservation.reservation_id})
  .update(updatedReservation)
}

async function destroy(reservationId){
  return knex("reservations")
  .where({"reservation_id": reservationId})
  .del();
}

function getBlackoutDay(){
  const BLACKOUT_DAY = process.env.BLACKOUT_DAY || "Tuesday";

  return BLACKOUT_DAY;
}

/**
 * Returns starting time for reservations of a given day
 * 
 * @returns {array where index 0 is hours, and index 1 is minutes}
 */
function getReservationStartTime(){
  const RESERVATION_START_HOUR = process.env.RESERVATION_START_HOUR || "10";
  const RESERVATION_START_MINUTE = process.env.RESERVATION_START_MINUTE || "30";
  return [RESERVATION_START_HOUR, RESERVATION_START_MINUTE];
}

/**
 * Returns ending time for reservations of a given day
 * @returns {array where index 0 is hours, and index 1 is minutes}
 */
function getReservationEndTime(){
  const RESERVATION_END_HOUR = process.env.RESERVATION_END_HOUR || "21";
  const RESERVATION_END_MINUTE = process.env.RESERVATION_END_MINUTE || "30";
  return [RESERVATION_END_HOUR, RESERVATION_END_MINUTE];
}



module.exports = {list, read, create, update, destroy, getBlackoutDay, getReservationStartTime, getReservationEndTime}
