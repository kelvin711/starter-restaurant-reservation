// src/middleware/tablesValidation.middleware.js

function validateTableData(req, res, next) {
    const { data } = req.body;

    // Check if data object is present
    if (!data) {
        return res.status(400).json({ error: "Data is missing" });
    }

    // Validate table_name
    if (!data.table_name) {
        return res.status(400).json({ error: "table_name is missing" });
    }
    if (data.table_name === "") {
        return res.status(400).json({ error: "table_name cannot be empty" });
    }
    if (data.table_name.length === 1) {
        return res.status(400).json({ error: "table_name must be longer than one character" });
    }

    // Validate capacity
    if (data.capacity === undefined) {
        return res.status(400).json({ error: "capacity is missing" });
    }
    if (typeof data.capacity !== 'number' || data.capacity < 1) {
        return res.status(400).json({ error: "capacity must be a number greater than 0" });
    }

    next();
}

function validateSeatRequest(req, res, next) {
    // const { data } = req.body;

    // if (!data || !data.reservation_id) {
    //     return res.status(400).json({ error: "Data is missing or reservation_id is missing" });
    // }
    // if (typeof data.reservation_id !== 'number') {
    //     return res.status(400).json({ error: "reservation_id must be a number" });
    // }

    // next();
    const { data } = req.body;
    if (!data || data.reservation_id === undefined) {
        return res.status(400).json({ error: "Data is missing or reservation_id is missing." });
    }

    const reservationId = parseInt(data.reservation_id, 10);
    if (isNaN(reservationId)) {
        return res.status(400).json({ error: "reservation_id must be a valid number." });
    }

    // Attach the parsed reservationId to the request object for further use
    req.parsedReservationId = reservationId;
    next();
}


module.exports = {
    validateTableData,
    validateSeatRequest
};
