const knex = require("../db/connection");
require("dotenv").config();

async function list(queryDate){

    return knex("reservations as r")
    .leftJoin("tables as t", function() {
      this.on("r.reservation_id", "=", "t.reservation_id")
      this.andOnVal("r.reservation_date", "=", queryDate)
    })
    .select("r.*", 
      //knex.raw("(select case when t.reservation_id is null then 'waiting' else 'seated' end) as seat_status"),
      knex.raw("to_char(r.reservation_date, 'YYYY-MM-DD') as formatted_date"),
      knex.raw("to_char(r.reservation_time, 'HH12:MIPM') as formatted_time")
      )
    .where({"r.reservation_date": queryDate})
    .orderBy("r.reservation_date", "asc")
    .orderBy("r.reservation_time", "asc")
}

async function read(reservationId){

  return knex("reservations as r")
  .select("r.*",
      knex.raw("to_char(r.reservation_date, 'YYYY-MM-DD') as formatted_date"),
      knex.raw("to_char(r.reservation_time, 'HH12:MIPM') as formatted_time")
  )
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

async function updateStatus(reservation_id, status){

  await knex("reservations")
  .where({"reservation_id": reservation_id})
  .update({status: status})
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



module.exports = {list, read, create, update, updateStatus, destroy, getBlackoutDay, getReservationStartTime, getReservationEndTime}
