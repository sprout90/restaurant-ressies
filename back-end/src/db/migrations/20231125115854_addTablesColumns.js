
exports.up = function(knex) {
  return knex.schema.table("tables", (table) => {
    table.string("table_name");
    table.integer("capacity");  
    table.integer("reservation_id");
    table.foreign("reservation_id").references("reservation_id").inTable("reservations")
  });
}

exports.down = function(knex) {
  return knex.schema.table("tables", (table) => {
    table.dropColumn("table_name");
    table.dropColumn("capacity");
    table.dropForeign("reservation_id");
    table.dropColumn("reservation_id");
  });
}
