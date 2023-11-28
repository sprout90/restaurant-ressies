import React from "react";

function ReservationSeatBtn({reservation_id, seat_status}){

  if (seat_status !== "seated"){
    return (
      <a id="seat" name="seat" className="btn btn-primary" href={`/reservations/${reservation_id}/seat`} >
        Seat
      </a>
    )
  } else {
    return (<p>Seated</p>)
  }

};

export default ReservationSeatBtn;


