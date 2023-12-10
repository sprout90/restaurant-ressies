import React from "react";

function ReservationSeatBtn({reservation_id, status}){

  if (status === "booked"){
    return (
      <a id="seat" 
        name="seat" 
        className="btn btn-primary" 
        href={`/reservations/${reservation_id}/seat`} >
        Seat
      </a>
    )
  } else {
    return (<p>N/A</p>)
  }

};

export default ReservationSeatBtn;


