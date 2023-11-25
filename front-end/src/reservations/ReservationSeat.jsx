import React, {useState, useEffect} from "react";
import { useParams, useRouteMatch, useHistory} from "react-router-dom";
import { readReservation} from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat(){


  return (
    <div>
      <p>reservation seat</p>
    </div>
  );

}

export default ReservationSeat;