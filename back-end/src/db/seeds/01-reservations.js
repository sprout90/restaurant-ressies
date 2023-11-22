const reservations = require("./00-reservations.json");

exports.seed = function(knex) {
  
  // add reservations from json test file
  return knex('reservations')
  .insert(reservations)
};
