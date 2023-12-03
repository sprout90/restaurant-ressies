import React from "react";

function ReservationCancelBtn({reservation_id, table_id, cancelHandler}){

  return (
      <a id="cancel" 
        name="cancel" 
        className="btn btn-primary" 
        data-reservation-id-cancel={`${reservation_id}`}
        data-table-id-cancel={`${table_id}`}
        onClick={cancelHandler} >
        Cancel
      </a>
    )

    
};

export default ReservationCancelBtn;
