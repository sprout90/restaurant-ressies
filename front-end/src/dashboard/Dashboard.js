import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ReservationList from "../reservations/ReservationList"
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
 
  useEffect(() => {

    const abortController = new AbortController();

    async function loadReservations(abortController) {
  
      setReservationsError(null);
    
      try{
        const result = await listReservations(date, abortController.signal);
        setReservations(result)
      } catch (error){
        setReservationsError(error)
      }
    }

    loadReservations(abortController);

    return () => abortController.abort();
  }, [date]);

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
