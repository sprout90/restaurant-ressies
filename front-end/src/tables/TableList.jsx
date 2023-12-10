import React from "react";
import TableListRow from "./TableListRow";

function TableList({tables, finishTableHandler}){

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
          <span>Action</span>
        </div>

    </div>
    <div>
    {tables.map((table, index) =>  
          <TableListRow table={table} key={index} index={index} finishTableHandler={finishTableHandler}/>
          ) 
    }
    </div>
  </div>
  );
}

export default TableList;