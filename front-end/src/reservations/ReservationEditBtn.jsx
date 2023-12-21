import React from "react";

// Display enabled or disabled Reservation Edit button
// determined by "booked" status
function ReservationEditBtn({ reservation_id, status }) {
  if (status === "booked") {
    return (
      <a
        id="edit"
        name="edit"
        className="btn btn-primary"
        href={`/reservations/${reservation_id}/edit`}
      >
        Edit
      </a>
    );
  } else {
    return (
      <button id="edit" name="edit" className="btn btn-primary" disabled={true}>
        Edit
      </button>
    );
  }
}

export default ReservationEditBtn;
