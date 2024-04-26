/**
 * List handler for reservation resources
 */
const {
  listReservations,
  listReservationsByDate,
  readReservation,
  createReservation,
  changeReservation,
  updateReservationStatus,
  searchReservationsByPhoneNumber
} = require("./reservations.service");

async function list(req, res, next) {
  const { date, mobile_number } = req.query;

  try {
    let data;
    if (date) {
      // Call a service function that lists reservations by date excluding 'finished' ones
      data = await listReservationsByDate(date);
    } else if (mobile_number) {
      // Call the search function if mobile_number is provided
      data = await searchReservationsByPhoneNumber(mobile_number);
    } else {
      // Call a service function that lists all reservations if no specific query is provided
      data = await listReservations();
    }
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function read(req, res, next) {
  const { reservation_id } = req.params;

  try {
    const reservation = await readReservation(reservation_id);

    if (!reservation) {
      return res.status(404).json({ error: `Reservation with ID ${reservation_id} not found.` });
    }

    res.status(200).json({ data: reservation });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const newReservation = await createReservation(req.body.data);
    res.status(201).json({ data: newReservation });
  } catch (error) {
    next(error); // Error handling middleware will take care of any errors.
  }
}

async function updateStatus(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;

  try {
    const updatedReservation = await updateReservationStatus(reservation_id, status);
    if (!updatedReservation) {
      return res.status(404).json({ error: `Reservation with ID ${reservation_id} not found.` });
    }

    res.status(200).json({ data: updatedReservation });
  } catch (error) {
    const message = error.message;
    if (message.includes('not found')) {
      return res.status(404).json({ error: message });
    } else if (message.includes('cannot be updated')) {
      return res.status(400).json({ error: message });
    } else {
      next(error);  // Handle other unexpected errors
    }
  }
}

async function updateReservation(req, res, next) {
  const reservationId = req.params.reservation_id; // Extract the reservation ID from the URL
  console.log('Controller received ID:', reservationId); // Log the received ID for debugging
  
  try {
    // Call the service function with the updated reservation data and the ID
    const data = await changeReservation(req.body.data, reservationId); 
    res.status(200).json({ data });
  } catch (error) {
    console.error('Controller error:', error.message); // Log the error message
    next(error); // Pass any errors to the error handling middleware
  }
}

module.exports = {
  list,
  read,
  create,
  updateStatus,
  updateReservation
};