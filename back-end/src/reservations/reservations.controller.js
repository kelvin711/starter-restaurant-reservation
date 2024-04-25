/**
 * List handler for reservation resources
 */
const {
  listReservations,
  readReservation,
  createReservation,
  seatAtTable
} = require("./reservations.service");

async function list(req, res, next) {
  const { date } = req.query;
  try {
    const data = await listReservations(date);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function read(req, res, next) {
  const { reservation_Id } = req.params;

  try {
    const reservation = await readReservation(reservation_Id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
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

module.exports = {
  list,
  read,
  create,
};