import React from "react";

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
        {reservation.reservation_date}
      </div>
      <div className="col-2">
        {reservation.reservation_time}
      </div>
      <div className="col-2">
        {reservation.people}
      </div>
    </div>
  );

}

export default ReservationListRow;
