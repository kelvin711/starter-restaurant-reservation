/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const validationMiddleware = require("../middleware/reservationValidation.middleware")

router.get('/:reservation_Id', controller.read);

router.route("/")
  .get(validationMiddleware.hasQuery, controller.list)
  .post(
    validationMiddleware.hasRequiredFields,
    validationMiddleware.validateReservationDate,
    validationMiddleware.validateReservationTime,
    validationMiddleware.validateReservationStatus,
    controller.create
  );

router.put('/:reservation_id/status',
  validationMiddleware.validateStatus,
  controller.updateStatus
);

module.exports = router;
