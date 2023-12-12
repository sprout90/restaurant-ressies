import React from "react";

function ReservationSeatBtn({ reservation_id, status }) {
  // if reservation status === booked, then display enabled
  // Seat button
  if (status === "booked") {
    return (
      <a
        id="seat"
        name="seat"
        className="btn btn-primary"
        href={`/reservations/${reservation_id}/seat`}
      >
        Seat
      </a>
    );
  } else {
    // otherwise display disabled Seat button
    return (
      <a id="seat" name="seat" className="btn btn-primary" disabled="true">
        Seat
      </a>
    );
  }
}

export default ReservationSeatBtn;
