exports.up = function (knex) {
    return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.string("table_name").notNullable(); // Ensure the table name cannot be null.
        table.integer("capacity").unsigned().notNullable(); // Ensure capacity cannot be null and is a positive number.
        table.integer("reservation_id").unsigned().nullable(); // Allow reservation_id to be null.
        table.foreign("reservation_id")
            .references("reservation_id")
            .inTable("reservations")
            .onDelete("SET NULL"); // Set the foreign key to null if the referenced reservation is deleted.
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("tables");
};