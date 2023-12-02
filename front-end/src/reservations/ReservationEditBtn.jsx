import React from "react";

function ReservationEditBtn({reservation_id, status}){

  if (status === "booked"){
    return (
      <a id="edit" 
        name="edit" 
        className="btn btn-primary" 
        data-reservation-id-status={`${reservation_id}`}
        href={`/reservations/${reservation_id}/edit`} >
        Edit
      </a>
    )
  } else {
    return (<p>N/A</p>)
  }

};

export default ReservationEditBtn;
