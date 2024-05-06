function isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false;  // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
}

function isValidTime(timeString) {
    const regEx = /\d{2}:\d{2}/;
    return regEx.test(timeString);
}

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

function isFutureDate(dateString) {
    const reservationDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservationDate >= today;
}

function isNotTuesday(dateString) {
    // Parse the dateString as local time by adding the time part
    const localDateString = `${dateString}T00:00:00`;
    const reservationDate = new Date(localDateString);
    return reservationDate.getDay() !== 2;
}

function isValidTimeframe(timeString) {
    const minutes = (h, m) => h * 60 + m;
    const reservationTime = minutes(...timeString.split(':').map(Number));
    const openingTime = minutes(10, 30); // 10:30 AM in minutes
    const lastSeatingTime = minutes(21, 30); // 9:30 PM in minutes
    return reservationTime >= openingTime && reservationTime <= lastSeatingTime;
}

function isNotInThePast(dateString, timeString) {
    const reservationDateTime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    return reservationDateTime >= now;
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

function validateReservationDate(req, res, next) {
    const { reservation_date } = req.body.data;
    if (!isFutureDate(reservation_date)) {
        return res.status(400).json({ error: "Reservation must occur in the future." });
    }
    if (!isNotTuesday(reservation_date)) {
        return res.status(400).json({ error: "The restaurant is closed on Tuesdays." });
    }
    return next();
}

function validateReservationTime(req, res, next) {
    const { reservation_date, reservation_time } = req.body.data;

    if (!isValidTimeframe(reservation_time)) {
        return res.status(400).json({ error: "Reservation time must be between 10:30 AM and 9:30 PM." });
    }

    if (!isNotInThePast(reservation_date, reservation_time)) {
        return res.status(400).json({ error: "Reservation date and time must be in the future." });
    }

    next();
}

function validateReservationStatus(req, res, next) {
    const { status } = req.body.data;

    // Allow only 'booked' status for new reservations
    if (status && status !== 'booked') {
        return res.status(400).json({ error: `Invalid reservation status: '${status}'. Only 'booked' is allowed for new reservations.` });
    }

    next();
}

function validateStatus(req, res, next) {
    const validStatuses = ['booked', 'seated', 'finished', 'cancelled'];
    const { status } = req.body.data;

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status value: ${status}` });
    }

    next();
}

module.exports = {
    hasRequiredFields,
    validateDateQuery,
    hasQuery,
    validateReservationDate,
    validateReservationTime,
    validateReservationStatus,
    validateStatus
};
