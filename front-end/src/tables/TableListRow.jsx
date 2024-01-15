import React from "react";
import TableFinishBtn from "./TableFinishBtn";

function TableListRow({table, finishTableHandler}){

  const renderStatus = (status) => {

    if (table.reservation_id){
      return "Occupied"
    } else {
      return "Free"
    }
  }

  return (
    <tr data-table-id-status={table.table_id}>
    <td>
      {table.table_name}
    </td>
    <td>
      {table.capacity}
    </td>
    <td>
      {renderStatus(table.status)}
    </td>
    <td>
      <TableFinishBtn table={table} finishTableHandler={finishTableHandler}/>
    </td>
  </tr>
  );
}

export default TableListRow;