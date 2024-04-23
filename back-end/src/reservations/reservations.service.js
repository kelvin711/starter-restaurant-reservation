const knex = require("../db/connection");

async function listReservations(date) {
  if (date) {
    return knex('reservations')
      .select('*')
      .where('reservation_date', date)
      .orderBy('reservation_time', 'asc');
  }
  return knex('reservations').select('*');
}


function createReservation(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  listReservations,
  createReservation,
};