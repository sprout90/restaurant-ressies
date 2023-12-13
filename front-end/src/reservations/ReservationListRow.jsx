import React from "react";
import ReservationSeatBtn from "./ReservationSeatBtn";
import ReservationEditBtn from "./ReservationEditBtn";
import ReservationCancelBtn from "./ReservationCancelBtn";

function ReservationListRow({ reservation, cancelHandler }) {
  return (
    <div className="row">
      <div className="col-3">
        {reservation.first_name}&nbsp;{reservation.last_name}
      </div>
      <div className="col-2">{reservation.mobile_number}</div>
      <div className="col-2">
        {reservation.formatted_date}&nbsp;{reservation.formatted_time}
      </div>
      <div className="col-1">{reservation.people}</div>
      <div className="col-1">
        <span data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </span>
      </div>
      <div className="col-1">
        <ReservationSeatBtn
          reservation_id={reservation.reservation_id}
          status={reservation.status}
        />
      </div>
      <div className="col-1">
        <ReservationEditBtn
          reservation_id={reservation.reservation_id}
          status={reservation.status}
        />
      </div>
      <div className="col-1">
        <ReservationCancelBtn
          reservation_id={reservation.reservation_id}
          table_id={reservation.table_id}
          cancelHandler={cancelHandler}
          status={reservation.status}
        />
      </div>
    </div>
  );
}

export default ReservationListRow;
