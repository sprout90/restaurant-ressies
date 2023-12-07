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
      message: `Table (${table_id}) is occupied. Reservation must be placed at an open to accept seating.`,
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
      message: `Table_id (${table_id}) is not occupied.  Table must be occupied to allow finish event.`,
    });
  } else {
    return next();
  }
}

async function validReservationCapacity(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;
  const { reservation_id } = req.body.data;

  if (capacity >= people === false) {
    next({
      status: 400,
      message: `Reservation cannot exceed the table capacity. Table capacity: ${capacity}`,
    });
  } else {
    return next();
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

async function updateSeat(req, res, next) {
  const table_id = res.locals.table.table_id;
  const { reservation_id } = req.body.data;
  const data = await service.updateSeat(table_id, reservation_id);

  res.json({ data });
}

async function deleteSeat(req, res, next) {
  const table_id = res.locals.table.table_id;
  const reservation_id = null;
  const data = await service.updateSeat(table_id, reservation_id);

  res.json({ data });
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
  updateSeat: [
    asyncErrorBoundary(tableExists),
    validSeatRequest,
    validFreeSeat,
    validReservationIdRequest,
    validReservationId,
    validReservationCapacity,
    asyncErrorBoundary(updateSeat),
  ],
  deleteSeat: [
    asyncErrorBoundary(tableExists),
    validOccupiedSeat,
    asyncErrorBoundary(deleteSeat),
  ],
  destroy: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
