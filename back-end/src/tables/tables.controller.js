const service = require("./tables.service.js");
const reservationService = require("../reservations/reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");

// VALIDATION FUNCTIONS
async function tableExists(req, res, next) {
  const { tableId } = req.params;
  const table = await service.read(tableId);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    next({ status: 404, message: `Table ${tableId} record cannot be found.` });
  }
}

async function validCapacity(req, res, next) {
  const { capacity } = req.body.data;

  if (isNaN(capacity) === true || typeof capacity !== "number") {
    return next({
      status: 400,
      message: `The capacity field must contain a valid number.`,
    });
  }

  if (capacity < 1) {
    next({ status: 400, message: `Capacity must be 1 or greater.` });
  } else {
    return next();
  }
}

async function validTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2) {
    next({
      status: 400,
      message: `The table_name field must be greater than 1 character.`,
    });
  } else {
    return next();
  }
}

async function validSeatRequest(req, res, next) {
  if (!req.body.data) {
    next({ status: 400, message: `Invalid seat request.  Missing data.` });
  } else {
    return next();
  }
}

async function validReservationIdRequest(req, res, next) {
  const data = req.body.data;

  if (!data.reservation_id) {
    next({
      status: 400,
      message: `Invalid seat request.  Missing reservation_id`,
    });
  } else {
    return next();
  }
}

async function validReservationId(req, res, next) {
  const reservationId = req.body.data.reservation_id;
  const reservation = await reservationService.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    next({
      status: 404,
      message: `Reservation ${reservationId} record cannot be found.`,
    });
  }
}

async function validFreeSeat(req, res, next) {
  const { table_id, reservation_id } = res.locals.table;
  if (reservation_id !== null) {
    next({
      status: 400,
      message: `Table (${table_id}) is already seated and occupied. Reservation must be placed at an open table to accept seating.`,
    });
  } else {
    return next();
  }
}

async function validOccupiedSeat(req, res, next) {
  const { table_id, reservation_id } = res.locals.table;
  if (reservation_id === null) {
    next({
      status: 400,
      message: `Table_id (${table_id}) is not occupied and seated.  Table must be seated to allow finish event.`,
    });
  } else {
    return next();
  }
}

async function validReservationCapacity(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;

  if (capacity >= people === false) {
    next({
      status: 400,
      message: `Reservation cannot exceed the table capacity. Table capacity: ${capacity}`,
    });
  } else {
    return next();
  }
}

async function validReservationStatus(req, res, next) {
  const { reservation_id, status } = res.locals.reservation

  valid = (res.locals.reservation.status === "seated") ? false : true;
  if (valid) {
    return next();
  } else {
    next({
      status: 400,
      message: `The reservation with already seated status cannot be seated.`,
    });
  }

}


// SERVICE FUNCTIONS

/**
 * List handler for tables resources
 */
async function list(req, res) {
  const { date } = req.query;
  const result = await service.list(date);
  res.json({ data: result });
}

async function read(req, res, next) {
  res.json({ data: res.locals.table });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res, next) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };

  const data = await service.update(updatedTable);

  res.json({ data });
}

async function fillSeat(req, res, next) {
  const table_id = res.locals.table.table_id;
  const { reservation_id } = req.body.data;

  const data = await service.updateSeat(table_id, reservation_id);
  const reservation = await reservationService.updateStatus(reservation_id, "seated");

  res.status(200).json({ data });
}


async function updateSeat(req, res, next) {
  const { table_id } = res.locals.table;
  const { reservation_id } = req.body.data;
  const data = await service.updateSeat(table_id, reservation_id);

  res.status(200).json({ data });
}

async function deleteSeat(req, res, next) {

  // default status value to finished, other set to body.data value
  let status = "finished"
  if ((req.body.data) && (req.body.data.status)){
    const data = req.body.data;
    status = data["status"]
  }
  console.log("delete status ", status)

  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.table;
  const table = await service.updateSeat(table_id, null);
  console.log("updated seat ", table)
  const reservation = await reservationService.updateStatus(reservation_id, status);
  console.log("updated ressie ", reservation)

  res.json({ table });
}

async function destroy(req, res, next) {
  await service.destroy(res.locals.table.table_id);
  res.sendStatus(204);
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  create: [
    hasRequiredProperties,
    validCapacity,
    validTableName,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(tableExists),
    hasRequiredProperties,
    validCapacity,
    validTableName,
    asyncErrorBoundary(update),
  ],
  fillSeat: [
    asyncErrorBoundary(tableExists),
    validSeatRequest,
    validFreeSeat,
    validReservationIdRequest,
    validReservationId,
    validReservationCapacity,
    validReservationStatus,
    asyncErrorBoundary(fillSeat),
  ],
  deleteSeat: [
    asyncErrorBoundary(tableExists),
    validOccupiedSeat,
    asyncErrorBoundary(deleteSeat),
  ],
  destroy: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
