const knex = require("../db/connection");
require("dotenv").config();

async function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name", "asc")
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
