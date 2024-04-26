/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const router = require("express").Router();
const controller = require("./tables.controller");
const validationMiddleware = require("../middleware/tableValidation.middleware")

router.route("/")
    .get(controller.list)
    .post(
        validationMiddleware.validateTableData, 
        controller.create
    );

router.route("/:table_id/seat")
    .put(validationMiddleware.validateSeatRequest, controller.seat)
    .delete(controller.completeTable);

router.route("/:table_id")
    .get(controller.getTableById);

module.exports = router;
