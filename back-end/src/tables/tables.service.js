const knex = require("../db/connection");
require("dotenv").config();

async function list(queryDate){

    return knex("tables as t")
    .leftJoin("reservations as r", function() {
      this.on("t.reservation_id", "=", "r.reservation_id")
      this.andOnVal("r.reservation_date", "=", queryDate)
    })
    .select("t.*", 
      "r.*",
      knex.raw("to_char(r.reservation_date, 'YYYY-MM-DD') as formatted_date"),
      knex.raw("to_char(r.reservation_time, 'HH12:MIPM') as formatted_time"),
      knex.raw("(case when r.reservation_date is null then 'Free' else 'Occupied' end) as status")
      )
    .orderBy("t.table_name", "asc")

}

async function read(tableId){

  return knex("tables")
  .select("*")
  .where({"table_id": tableId})
  .first();
}

async function create(newTable){

  await knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdRecords) => createdRecords[0])

}

async function update(updatedTable){
  await knex("tables")
  .select("*")
  .where({"table_id": updatedTable.table_id})
  .update(updatedTable)
}

async function destroy(tableId){
  return knex("tables")
  .where({"table_id": tableId})
  .del();
}

module.exports = {list, read, create, update, destroy}
