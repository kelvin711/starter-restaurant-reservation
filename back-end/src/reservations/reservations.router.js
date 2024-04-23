/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const validationMiddleware = require("../middleware/validation.middleware")

router.route("/")
  .get(validationMiddleware.hasQuery, controller.list)
  .post(
    validationMiddleware.hasRequiredFields, 
    validationMiddleware.validateReservationDate, 
    validationMiddleware.validateReservationTime,
    controller.create
);

module.exports = router;
