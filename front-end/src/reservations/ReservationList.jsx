import React from "react";
import ReservationListRow from "./ReservationListRow";

/* display the list of reservations 
   Currently used by Search result, and Dashboard pages
*/
function ReservationList({ reservations, cancelHandler }) {
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>
              Date & Time
            </th>
            <th>
              People
            </th>
            <th>
              Status
            </th>
            <th>
              Table
            </th>
            <th>
              Edit
            </th>
            <th>
              Cancel
            </th>
          </tr>
        </thead>
        <tbody>
        {reservations.map((reservation, index) => (
          <ReservationListRow
            reservation={reservation}
            cancelHandler={cancelHandler}
            key={reservation.reservation_id}
            index={index}
          />
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationList;
