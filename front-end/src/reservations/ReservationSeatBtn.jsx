import React from "react";

function ReservationSeatBtn({reservation_id}){

  return (
    <a id="seat" name="seat" className="btn btn-primary" href={`/reservations/${reservation_id}/seat`} >
      Seat
    </a>
  )

};

export default ReservationSeatBtn;


