const knex = require("../db/connection");

async function listReservations() {
  return knex('reservations')
    .select('*')
    .orderBy(['reservation_date', 'reservation_time']);
}

async function listReservationsByDate(date) {
  return await knex('reservations')
    .select('*')
    .where('reservation_date', date)
    .andWhereNot('status', 'finished')
    .orderBy(['reservation_date', 'reservation_time']);
}

function createReservation(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

async function readReservation(reservationId) {
  const reservation = await knex('reservations')
    .select('*')
    .where({ reservation_id: reservationId })
    .first();
  return reservation;
}

async function updateReservationStatus(reservation_id, status) {
  return await knex.transaction(async trx => {
    const reservation = await trx('reservations').where({ reservation_id }).first();

    // Check if the reservation exists
    if (!reservation) {
      throw new Error(`Reservation with ID ${reservation_id} not found.`);
    }

    // Prevent updating if the reservation status is "finished"
    if (reservation.status === 'finished' && status !== 'finished') {
      throw new Error('A finished reservation cannot be updated.');
    }

    // Update the reservation status
    await trx('reservations').where({ reservation_id }).update({ status });

    // Return the updated reservation
    return await trx('reservations').where({ reservation_id }).first();
  });
}

async function validateReservationExists(reservation_id) {
  const reservation = await knex('reservations')
    .select('*')
    .where({ reservation_id })
    .first();

  if (!reservation) {
    throw new Error(`No reservation with ID ${reservation_id}`);
  }

  return reservation; // Proceed with a valid reservation
}

function searchReservationsByPhoneNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') LIKE ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}


module.exports = {
  listReservations,
  listReservationsByDate,
  readReservation,
  createReservation,
  updateReservationStatus,
  validateReservationExists,
  searchReservationsByPhoneNumber
};