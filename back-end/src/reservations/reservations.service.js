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

async function createReservation(newReservation) {
  const createdRecords = await knex("reservations")
    .insert(newReservation)
    .returning("*");
  return createdRecords[0];
}

async function readReservation(reservationId) {
  const reservation = await knex('reservations')
    .select('*')
    .where({ reservation_id: reservationId })
    .first();
  return reservation;
}

async function changeReservation(updatedReservation, reservationId) {
  try {
    const updatedRecords = await knex("reservations")
      .where({ reservation_id: reservationId }) // Use the reservation ID from the request parameters
      .update(updatedReservation, "*");

    if (!updatedRecords || updatedRecords.length === 0) {
      const error = new Error(`Reservation with ID ${reservationId} not found.`);
      error.status = 404; // Set the status for the error handler
      throw error;
    }

    return updatedRecords[0]; // Return the first (and should be only) updated record
  } catch (error) {
    console.error('Service error:', error.message); // Log the error message
    throw error; // Rethrow the error to be caught by the controller
  }
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
  searchReservationsByPhoneNumber,
  changeReservation
};