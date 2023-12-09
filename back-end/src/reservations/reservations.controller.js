const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const {
  dayOfWeek,
  lessThanToday,
  lessThanDefinedTime,
  greaterThanDefinedTime,
  validDate,
  validTime,
} = require("../utils/date-time.js");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

// VALIDATION FUNCTIONS
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `Reservation ${reservationId} cannot be found.`,
    });
  }
}

async function validPeople(req, res, next) {
  const { people } = req.body.data;

  if (isNaN(people) === true || typeof people !== "number") {
    return next({
      status: 400,
      message: `The people field must contain a valid number.`,
    });
  }

  if (people < 1) {
    return next({
      status: 400,
      message: `The people field must be 1 or greater.`,
    });
  } else {
    return next();
  }
}

async function validQueryParameter(req, res, next) {
  const { date, mobile_number } = req.query;

  if (!date && !mobile_number) {
    next({
      status: 400,
      message: `Missing valid reservation list query parameter. Must be date or mobile_number.`,
    });
  } else {
    return next();
  }
}

async function validInputDate(req, res, next) {
  const { reservation_date } = req.body.data;

  const valid = validDate(reservation_date);
  if (valid) {
    return next();
  } else {
    next({
      status: 400,
      message: `The reservation_date field ${reservation_date} must be in a valid date format: YYYY-MM-DD`,
    });
  }
}

async function validWorkingDate(req, res, next) {
  const { reservation_date } = req.body.data;
  const requestDayOfWeek = dayOfWeek(reservation_date);
  const blackoutDay = service.getBlackoutDay();

  if (blackoutDay === requestDayOfWeek) {
    next({
      status: 400,
      message: `Reservations cannot be scheduled on ${blackoutDay}. Restaurant is closed.`,
    });
  } else {
    return next();
  }
}

async function validWorkingTime(req, res, next) {
  const { reservation_time } = req.body.data;

  // test for non-operating hours reservation
  const start = service.getReservationStartTime();
  const end = service.getReservationEndTime();

  const validStartTime = `${start[0]}:${start[1]}`;
  const validEndTime = `${end[0]}:${end[1]}`;

  if (
    lessThanDefinedTime(reservation_time, validStartTime) ||
    greaterThanDefinedTime(reservation_time, validEndTime)
  ) {
    next({
      status: 400,
      message: `Reservations cannot be scheduled before ${validStartTime} or after ${validEndTime}.`,
    });
  } else {
    return next();
  }
}

async function validPresentDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;

  if (lessThanToday(reservation_date, reservation_time)) {
    next({
      status: 400,
      message: `Reservations must be scheduled in the future.`,
    });
  } else {
    return next();
  }
}

async function validInputTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const valid = validTime(reservation_time);
  if (valid) {
    return next();
  } else {
    next({
      status: 400,
      message: `The reservation_time field (${reservation_time}) must be in a valid time format: HH:MM`,
    });
  }
}

async function validPhone(req, res, next) {
  const regexWithDashes = /^\d{3}-\d{3}-\d{4}$/;
  const regexNoDashes = /^\d{10}$/;
  let { mobile_number } = req.body.data;

  if (
    regexWithDashes.test(mobile_number) === true ||
    regexNoDashes.test(mobile_number) === true
  ) {
    return next();
  } else {
    next({
      status: 400,
      message: `The mobile number (${mobile_number}) is invalid. `,
    });
  }
}

function formatPhoneNumber(phoneNumberString) {
  const cleaned = ("" + phoneNumberString).replace(/\Dg/, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2] + "-" + match[3];
  }
  return null;
}

// SERVICE FUNCTIONS

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;

  if (date) {
    result = await service.listByDate(date);
  } else {
    if (mobile_number) {
      result = await service.listByNumber(mobile_number);
    }
  }
  res.json({ data: result });
}

async function read(req, res, next) {
  res.json({ data: res.locals.reservation });
}

async function create(req, res, next) {
  const newReservation = req.body.data;
  newReservation.status = "booked";
  const data = await service.create(req.body.data);

  res.status(201).json({ data });
}

async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };

  const data = await service.update(updatedReservation);

  res.json({ data });
}

async function updateStatus(req, res, next) {
  const reservation_id = res.locals.reservation.reservation_id;
  const { status } = req.body.data;
  const data = await service.updateStatus(reservation_id, status);
  const updatedStatus = data.status;

  res.status(200).json({ data: { status: data.status } });
}

async function destroy(req, res, next) {
  await service.destroy(res.locals.reservation.reservation_id);
  res.sendStatus(204);
}

module.exports = {
  list: [validQueryParameter, asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [
    hasRequiredProperties,
    validPhone,
    validInputDate,
    validWorkingDate,
    validPresentDate,
    validInputTime,
    validWorkingTime,
    validPeople,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    validPhone,
    validInputDate,
    validWorkingDate,
    validPresentDate,
    validInputTime,
    validWorkingTime,
    validPeople,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(updateStatus),
  ],
  destroy: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
};
