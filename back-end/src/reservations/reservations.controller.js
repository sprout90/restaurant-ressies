const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const {dayOfWeek, lessThanToday, lessThanDefinedTime, greaterThanDefinedTime} = require("../utils/date-time.js");
const hasRequiredProperties = hasProperties("first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people");

// VALIDATION FUNCTIONS
async function reservationExists(req, res, next){

  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  
  if (reservation) {
      res.locals.reservation = reservation;
      return next();
  } else {
      next({ status: 404, message: `Reservation cannot be found.` });
  }
}

async function validPeople(req, res, next){
  const {people} = req.body.data;
  if (people < 1){
    next({ status: 400, message: `People must be 1 or greater.` });

  } else {
    return next();
  }
}

async function validDate(req, res, next){
  const {reservation_date} = req.body.data;
  const date = new Date(reservation_date)
  if (isNaN(date.getTime()) === true){
    next({ status: 400, message: `Reservation date must be in a valid date format: YYYY-MM-DD` });

  } else {
    return next();
  }
}

async function validWorkingDate(req, res, next){
  const {reservation_date} = req.body.data;
  const requestDayOfWeek = dayOfWeek(reservation_date)
  const blackoutDay = service.getBlackoutDay();
  console.log("blackout and day-of-week ", blackoutDay, requestDayOfWeek)
  if (blackoutDay === requestDayOfWeek){
    next({ status: 400, message: `Reservations cannot be scheduled on ${blackoutDay}. Restaurant is closed.` });

  } else {
    return next();
  }
}

async function validWorkingTime(req, res, next){

  const {reservation_time} = req.body.data;

 // test for non-operating hours reservation
 const start = service.getReservationStartTime();
 const end = service.getReservationEndTime();

 const validStartTime = `${start[0]}:${start[1]}`;
 const validEndTime = `${end[0]}:${end[1]}`;

 if ((lessThanDefinedTime(reservation_time, validStartTime)) || (greaterThanDefinedTime(reservation_time, validEndTime))){
   next({ status: 400, message: `Reservations cannot be scheduled before ${validStartTime} or after ${validEndTime}.` });

 } else {
  next(); 
 }

}


async function validPresentDate(req, res, next){
  const {reservation_date, reservation_time} = req.body.data;
 
  if (lessThanToday(reservation_date, reservation_time)){
    next({ status: 400, message: `Reservations cannot be scheduled in the past.` });

  } else {
    return next();
  }
}

async function validTime(req, res, next){
  const regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const {reservation_time} = req.body.data;

  if (regex.test(reservation_time) === false){
    next({ status: 400, message: `Reservation time (${reservation_time}) must be in a valid time format: HH:MM` });

  } else {
    return next();
  }
}

async function validPhone(req, res, next){
  const regex = /^\d{3}-\d{3}-\d{4}$/;
  const {mobile_number} = req.body.data;

  if (regex.test(mobile_number) === false){
    next({ status: 400, message: `The mobile number (${mobile_number}) is invalid. ` });

  } else {
    return next();
  }
}

// SERVICE FUNCTIONS

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  const result = await service.list(date)
  res.json( { data: result  })
}

async function read(req, res, next){
  res.json( { data: res.locals.reservation })
}

async function create(req, res, next){
  const newReservation = req.body.data;
  newReservation.status = "booked";
  const data = await service.create(req.body.data);
 
  res.status(201).json({ data })
}

async function update(req, res, next){
  const updatedReservation = {
      ...req.body.data,
      reservation_id: res.locals.reservation.reservation_id,
    };
  
    const data = await service.update(updatedReservation);

    res.json({ data });
}

async function updateStatus(req, res, next){
  const reservation_id = res.locals.reservation.reservation_id;
  const { status } = req.body.data; 
  const data = await service.updateStatus(reservation_id, status);

  res.json({ data });
}

async function destroy(req, res, next){
  await service.destroy(res.locals.reservation.reservation_id);
  res.sendStatus(204);

}



module.exports = {
  list: [
    asyncErrorBoundary(list)
  ],
  read: [
    asyncErrorBoundary(reservationExists), 
    asyncErrorBoundary(read)
  ],
  create: [
    hasRequiredProperties, 
    validPhone, 
    validDate,
    validWorkingDate,
    validPresentDate,
    validTime,
    validWorkingTime,
    validPeople,
    asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(reservationExists), 
    hasRequiredProperties, 
    validPhone, 
    validDate,
    validWorkingDate,
    validPresentDate,
    validTime,
    validWorkingTime,
    validPeople,
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists), 
    asyncErrorBoundary(updateStatus)
  ],
  destroy: [
    asyncErrorBoundary(reservationExists), 
    asyncErrorBoundary(destroy)
  ]
};
