import React from "react";
import ReservationListRow from "./ReservationListRow";

function ReservationList({reservations, cancelHandler}){

 
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
            <span>Table</span>
          </div>
          <div className="col-1">
            <span>Edit</span>
          </div>
          <div className="col-1">
            <span>Cancel</span>
          </div>
      </div>
      <div>
      {reservations.map((reservation, index) =>  
            <ReservationListRow reservation={reservation} cancelHandler={cancelHandler} key={index} index={index}/>
            ) 
      }
      </div>
    </div>
    );
}


export default ReservationList;