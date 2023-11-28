import React from "react";
import ReservationListRow from "./ReservationListRow";

function ReservationList({reservations}){

 
    return ( 
      <div>
        <div className="row">
          <div className="col-4">
            <span>Name</span>
          </div>
          <div className="col-2">
            <span>Mobile</span>
          </div>
          <div className="col-2">
            <span>Reservation Date & Time</span>
          </div>
          <div className="col-1">
            <span>People</span>
          </div>
          <div className="col-1">
            <span>Seat</span>
          </div>
      </div>
      <div>
      {reservations.map((reservation, index) =>  
            <ReservationListRow reservation={reservation} key={index} index={index}/>
            ) 
      }
      </div>
    </div>
    );
}


export default ReservationList;