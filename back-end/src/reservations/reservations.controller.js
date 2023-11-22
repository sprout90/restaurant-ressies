const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
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

async function validTime(req, res, next){
  const regex = /^([0-2][0-3]):([0-5][0-9])$/;
  const {reservation_time} = req.body.data;

  if (regex.test(reservation_time) === false){
    next({ status: 400, message: `Reservation time must be in a valid time format: HH:MM` });

  } else {
    return next();
  }
}

async function validPhone(req, res, next){
  const regex = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
  const {mobile_number} = req.body.data;

  if (regex.test(mobile_number) === false){
    next({ status: 400, message: `Mobile number must be in a valid phone number format: 555-555-5555` });

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

  console.error("inside controller create ")
  const data = await service.create(req.body.data);
  console.error("body ", req.body)
  console.error("data ", data)
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
    validTime,
    validPeople,
    asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(reservationExists), 
    hasRequiredProperties, 
    validPhone, 
    validDate,
    validTime,
    validPeople,
    asyncErrorBoundary(update)
  ],
  destroy: [
    asyncErrorBoundary(reservationExists), 
    asyncErrorBoundary(destroy)
  ]
};
