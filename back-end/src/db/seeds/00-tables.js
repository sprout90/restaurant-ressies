const tables = require("./00-tables.json");

exports.seed = function(knex) {

  // add tables from json test file
  return knex('tables')
  .insert(tables)
};
