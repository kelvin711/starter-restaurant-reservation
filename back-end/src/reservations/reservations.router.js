/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const router = require("express").Router();
const controller = require("./reservations.controller");
const validationMiddleware = require("../middleware/reservationValidation.middleware")

router.route("/:reservation_id")
  .get(controller.read)
  .put(
    validationMiddleware.hasRequiredFields,
    validationMiddleware.validateReservationDate,
    validationMiddleware.validateReservationTime,
    controller.updateReservation
  );
router.route("/")
  .get(validationMiddleware.hasQuery, controller.list)
  .post(
    validationMiddleware.hasRequiredFields,
    validationMiddleware.validateReservationDate,
    validationMiddleware.validateReservationTime,
    validationMiddleware.validateReservationStatus,
    controller.create
  );
router.route("/:reservation_id/status")
  .put(
    validationMiddleware.validateStatus,
    controller.updateStatus
  );


module.exports = router;
