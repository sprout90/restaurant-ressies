import React from "react";

function ReservationSeatBtn({reservation_id, status}){

  if (status === "booked"){
    return (
      <a id="seat" 
        name="seat" 
        className="btn btn-primary" 
        data-reservation-id-status={`${reservation_id}`}
        href={`/reservations/${reservation_id}/seat`} >
        Seat
      </a>
    )
  } else {
    return (<p>Seated</p>)
  }

};

export default ReservationSeatBtn;


