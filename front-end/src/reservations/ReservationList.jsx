import React from "react";
import ReservationListRow from "./ReservationListRow";

function ReservationList({reservations, cancelHandler}){

 
    return ( 
      <div>
        <div className="row">
          <div className="col-3 font-weight-bold">
            <span>Name</span>
          </div>
          <div className="col-2 font-weight-bold">
            <span>Mobile</span>
          </div>
          <div className="col-2 font-weight-bold">
            <span>Date & Time</span>
          </div>
          <div className="col-1 font-weight-bold">
            <span>People</span>
          </div>
          <div className="col-1 font-weight-bold">
            <span>Status</span>
          </div>
          <div className="col-1 font-weight-bold">
            <span>Table</span>
          </div>
          <div className="col-1 font-weight-bold">
            <span>Edit</span>
          </div>
          <div className="col-1 font-weight-bold">
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