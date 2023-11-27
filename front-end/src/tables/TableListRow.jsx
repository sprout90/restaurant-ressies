import React from "react";

function TableListRow({table}){

  return (
    <div className="row" data-table-id-status={table.table_id}>
    <div className="col-2">
      {table.table_name}
    </div>
    <div className="col-2">
      {table.capacity}
    </div>
    <div className="col-2">
      {table.status}
    </div>
    <div className="col-2">
      {table.formatted_date}&nbsp;{table.formatted_time}
    </div>
  </div>
  );
}

export default TableListRow;