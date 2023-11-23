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

module.exports = {list, read, create, update, destroy, getBlackoutDay}