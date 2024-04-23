/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const validationMiddleware = require("../middleware/tableValidation.middleware")

router.route("/")
    .get(controller.list);

router.route("/:table_id")
    .get(controller.getTableById);

module.exports = router;
