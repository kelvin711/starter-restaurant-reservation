const tables = require("./01-tables.json");

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    .then(function () {
      // Inserting data from the JSON file into the 'tables' table
      return knex("tables").insert(tables);
    })
    .catch(function (error) {
      // Log the error if something goes wrong
      console.error(`Error seeding data: ${error.message}`);
    });
};
