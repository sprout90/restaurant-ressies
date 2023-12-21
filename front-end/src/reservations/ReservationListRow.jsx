import React from "react";
import ReservationSeatBtn from "./ReservationSeatBtn";
import ReservationEditBtn from "./ReservationEditBtn";
import ReservationCancelBtn from "./ReservationCancelBtn";

/* Display a single reservation row.
   Child of reservationList
*/
function ReservationListRow({ reservation, cancelHandler }) {
  return (
    <tr>
      <td>
        {reservation.first_name}&nbsp;{reservation.last_name}
      </td>
      <td>{reservation.mobile_number}</td>
      <td>
        {reservation.formatted_date}&nbsp;{reservation.formatted_time}
      </td>
      <td>{reservation.people}</td>
      <td>
        <span data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </span>
      </td>
      <td>
        <ReservationSeatBtn
          reservation_id={reservation.reservation_id}
          status={reservation.status}
        />
      </td>
      <td>
        <ReservationEditBtn
          reservation_id={reservation.reservation_id}
          status={reservation.status}
        />
      </td>
      <td>
        <ReservationCancelBtn
          reservation_id={reservation.reservation_id}
          table_id={reservation.table_id}
          cancelHandler={cancelHandler}
          status={reservation.status}
        />
      </td>
    </tr>
  );
}

export default ReservationListRow;
