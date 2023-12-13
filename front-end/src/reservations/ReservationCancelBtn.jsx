import React from "react";

function ReservationCancelBtn({
  reservation_id,
  table_id,
  cancelHandler,
  status,
}) {
  if (status !== "cancelled") {
    return (
      <button
        id="cancel"
        name="cancel"
        className="btn btn-primary"
        data-reservation-id-cancel={`${reservation_id}`}
        data-table-id-cancel={`${table_id}`}
        onClick={cancelHandler}
      >
        Cancel
      </button>
    );
  } else {
    return (
      <button
        id="cancel"
        name="cancel"
        className="btn btn-primary"
        disabled={true}
      >
        Cancel
      </button>
    );
  }
}

export default ReservationCancelBtn;
