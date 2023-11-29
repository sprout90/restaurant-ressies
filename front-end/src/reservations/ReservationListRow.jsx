import React from "react";
import ReservationSeatBtn from "./ReservationSeatBtn";

function ReservationListRow({reservation}){

   return (
    <div className="row">
      <div className="col-4">
        {reservation.first_name}&nbsp;{reservation.last_name}
      </div>
      <div className="col-2">
        {reservation.mobile_number}
      </div>
      <div className="col-2">
        {reservation.formatted_date}&nbsp;{reservation.formatted_time}
      </div>
      <div className="col-1">
        {reservation.people}
      </div>
      <div className="col-1">
        <ReservationSeatBtn reservation_id={reservation.reservation_id} status={reservation.status}/>
      </div>
    </div>
  );

}

export default ReservationListRow;
