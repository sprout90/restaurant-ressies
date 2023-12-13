import React from "react";

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
