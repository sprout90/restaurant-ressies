import React from "react";
import TableFinishBtn from "./TableFinishBtn";

function TableListRow({table, finishTableHandler}){

  const renderStatus = (status) => {

    if (status === "seated"){
      return "Occupied"
    } else {
      return "Free"
    }
  }

  return (
    <div className="row" data-table-id-status={table.table_id}>
    <div className="col-2">
      {table.table_name}
    </div>
    <div className="col-2">
      {table.capacity}
    </div>
    <div className="col-2">
      {renderStatus(table.status)}
    </div>
    <div className="col-2">
      {table.formatted_date}&nbsp;{table.formatted_time}
    </div>
    <div>
      <TableFinishBtn table={table} finishTableHandler={finishTableHandler}/>
    </div>
  </div>
  );
}

export default TableListRow;