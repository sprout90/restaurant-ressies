import React from "react";
import TableListRow from "./TableListRow";

function TableList({tables, finishTableHandler}){

  return ( 
    <div className="table-responsive">
      <table className="table">
        <thead>
          <th>
            Name
          </th>
          <th>
            Capacity
          </th>
          <th>
            Status
          </th>
          <th>
            Action
          </th>
      </thead>
    <tbody>
      {tables.map((table, index) =>  
            <TableListRow table={table} key={table.table_id} index={index} finishTableHandler={finishTableHandler}/>
            ) 
      }
      </tbody>
    </table>
  </div>
  );
}

export default TableList;