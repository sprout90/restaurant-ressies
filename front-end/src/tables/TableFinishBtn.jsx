import React from "react";

function TableFinishBtn({table, finishTableHandler}){


  if (table.status === "Occupied"){
    return (
      <button id="seat" 
        name="seat" 
        data-table-id-finish={table.table_id}
        className="btn btn-primary" 
        onClick={finishTableHandler} >
        Finish
      </button>
    )
  } else {
    return (null);
  }
};

export default TableFinishBtn;