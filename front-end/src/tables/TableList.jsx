import React from "react";
import TableListRow from "./TableListRow";

function TableList({tables}){

  return ( 
    <div>
      <div className="row">
        <div className="col-2">
          <span>Name</span>
        </div>
        <div className="col-2">
          <span>Capacity</span>
        </div>
        <div className="col-2">
          <span>Status</span>
        </div>
        <div className="col-2">
          <span>Res. Date & Time</span>
        </div>
    </div>
    <div>
    {tables.map((table, index) =>  
          <TableListRow table={table} key={index} index={index}/>
          ) 
    }
    </div>
  </div>
  );
}

export default TableList;