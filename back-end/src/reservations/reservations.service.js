const knex = require("../db/connection");
require("dotenv").config();

async function listByDate(queryDate) {
  return knex("reservations as r")
    .leftJoin("tables as t", function () {
      this.on("r.reservation_id", "=", "t.reservation_id");
    })
    .select(
      "r.*",
      "t.table_id",
      knex.raw("to_char(r.reservation_date, 'YYYY-MM-DD') as formatted_date"),
      knex.raw("to_char(r.reservation_time, 'HH12:MIPM') as formatted_time")
    )
    .where({ "r.reservation_date": queryDate })
    .orderBy("r.reservation_date", "asc")
    .orderBy("r.reservation_time", "asc");
}

async function listByNumber(queryMobileNumber) {
  const scrubbedNumber = queryMobileNumber.replace(/\D/g, "");
  const searchNumber = `%${scrubbedNumber}%`;

  return knex("reservations as r")
    .select(
      "r.*",
      knex.raw("to_char(r.reservation_date, 'YYYY-MM-DD') as formatted_date"),
      knex.raw("to_char(r.reservation_time, 'HH12:MIPM') as formatted_time")
    )
    .whereRaw("translate(r.mobile_number, '() -', '') like ?", searchNumber)
    .orderBy("r.reservation_date", "asc")
    .orderBy("r.reservation_time", "asc");
}

async function read(reservationId) {
  return knex("reservations as r")
    .select(
      "r.*",
      knex.raw("to_char(r.reservation_date, 'YYYY-MM-DD') as formatted_date"),
      knex.raw("to_char(r.reservation_time, 'HH12:MIPM') as formatted_time")
    )
    .where({ reservation_id: reservationId })
    .first();
}

async function create(newReservation) {
  return await knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function update(updatedReservation) {
  return await knex("reservations")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation)
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

async function updateStatus(reservation_id, status) {
  return await knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: status })
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

async function destroy(reservationId) {
  return knex("reservations").where({ reservation_id: reservationId }).del();
}

function getBlackoutDay() {
  const BLACKOUT_DAY = process.env.BLACKOUT_DAY || "Tuesday";

  return BLACKOUT_DAY;
}

/**
 * Returns starting time for reservations of a given day
 *
 * @returns {array where index 0 is hours, and index 1 is minutes}
 */
function getReservationStartTime() {
  const RESERVATION_START_HOUR = process.env.RESERVATION_START_HOUR || "10";
  const RESERVATION_START_MINUTE = process.env.RESERVATION_START_MINUTE || "30";
  return [RESERVATION_START_HOUR, RESERVATION_START_MINUTE];
}

/**
 * Returns ending time for reservations of a given day
 * @returns {array where index 0 is hours, and index 1 is minutes}
 */
function getReservationEndTime() {
  const RESERVATION_END_HOUR = process.env.RESERVATION_END_HOUR || "21";
  const RESERVATION_END_MINUTE = process.env.RESERVATION_END_MINUTE || "30";
  return [RESERVATION_END_HOUR, RESERVATION_END_MINUTE];
}

module.exports = {
  listByDate,
  listByNumber,
  read,
  create,
  update,
  updateStatus,
  destroy,
  getBlackoutDay,
  getReservationStartTime,
  getReservationEndTime,
};
