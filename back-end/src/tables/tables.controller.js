const service = require("./tables.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");

// VALIDATION FUNCTIONS
async function tableExists(req, res, next){

  const { tableId } = req.params;
  const table = await service.read(tableId);
  console.log("table Id in exists ", tableId)
  if (table) {
      res.locals.table = table;
      return next();
  } else {
      next({ status: 404, message: `Restaurant table cannot be found.` });
  }
}

async function validCapacity(req, res, next){
  const {capacity} = req.body.data;
  if (capacity < 1){
    next({ status: 400, message: `Capacity must be 1 or greater.` });

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
  const result = await service.list(date)
  res.json( { data: result })
}

async function read(req, res, next){
  res.json( { data: res.locals.table })
}

async function create(req, res, next){

  const data = await service.create(req.body.data);
  res.status(201).json({ data })
}

async function update(req, res, next){
  const updatedTable = {
      ...req.body.data,
      table_id: res.locals.table.table_id,
    };
  
    const data = await service.update(updatedTable);

    res.json({ data });
}

async function updateSeat(req, res, next){

  const table_id = res.locals.table.table_id;
  const { reservation_id } = req.body.data; 
  console.error("update seat params ", table_id, reservation_id)
  const data = await service.updateSeat(table_id, reservation_id);

  res.json({ data });
}


async function destroy(req, res, next){
  await service.destroy(res.locals.table.table_id);
  res.sendStatus(204);

}



module.exports = {
  list: [
    asyncErrorBoundary(list)
  ],
  read: [
    asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(read)
  ],
  create: [
    hasRequiredProperties, 
    validCapacity,
    asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(tableExists), 
    hasRequiredProperties, 
    validCapacity,
    asyncErrorBoundary(update)
  ],
  updateSeat: [
    asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(updateSeat)
  ], 
  destroy: [
    asyncErrorBoundary(tableExists), 
    asyncErrorBoundary(destroy)
  ]
};