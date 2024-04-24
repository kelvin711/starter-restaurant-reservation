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

module.exports = {
    validateTableData,
};
