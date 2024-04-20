function isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}

function isValidTime(timeString) {
    const regEx = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regEx.test(timeString);
}

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

function hasRequiredFields(req, res, next) {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({ error: "Body must have a data object" });
    }

    const requiredFields = ['first_name', 'last_name', 'mobile_number', 'reservation_date', 'reservation_time', 'people'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length) {
        return res.status(400).json({ error: `The following fields are missing: ${missingFields.join(', ')}` });
    }

    const errors = [];
    if (data.reservation_date && !isValidDate(data.reservation_date)) {
        errors.push('reservation_date must be a valid date');
    }
    if (data.reservation_time && !isValidTime(data.reservation_time)) {
        errors.push('reservation_time must be a valid time');
    }
    if (!isPositiveInteger(req.body.data.people)) {
        return res.status(400).json({ error: "Field 'people' must be a number greater than 0." });
    }

    if (errors.length) {
        return res.status(400).json({ error: errors.join(', ') });
    }


    // If data is valid, move on to the next middleware/route handler
    next();
}

function validateDateQuery(req, res, next) {
    const { date } = req.query;
    // If there is a date query parameter, validate it
    if (date && !isValidDate(date)) {
        return res.status(400).json({ error: "Invalid date format" });
    }
    // If no date is provided or the date is valid, proceed to the next middleware
    next();
}

function hasQuery(req, res, next) {
    const dateFormat = /\d{4}-\d{2}-\d{2}/;
    if (req.query.date && dateFormat.test(req.query.date)) {
      res.locals.date = req.query.date;
    }
    if (req.query.mobile_number) {
      res.locals.mobile_number = req.query.mobile_number;
    }
    next();
  }

module.exports = {
    hasRequiredFields,
    validateDateQuery,
    hasQuery
};