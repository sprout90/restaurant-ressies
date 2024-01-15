import React from "react";

function TableFinishBtn({table, finishTableHandler}){

  // Display the finish button if called for a table with 
  // reservation. 
  // Else return null
  if (table.reservation_id){
    return (
      <button id="finish" 
        name="finish" 
        data-table-id-finish={table.table_id}
        data-reservation-id-finish={table.reservation_id}
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