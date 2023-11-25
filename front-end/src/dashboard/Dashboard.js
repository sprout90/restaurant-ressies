import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../reservations/ReservationList"
import TableList from "../tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date = today()}) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date);

    useEffect(() => {

    const abortController = new AbortController();

    async function loadReservations(abortController) {
  
      setReservationsError(null);
      date = reservationDate;
    
      try{
        const result = await listReservations({date}, abortController.signal);
        setReservations(result)
      } catch (error){
        setReservationsError(error)
      }
    }

    loadReservations(abortController);

    return () => abortController.abort();
  }, [reservationDate]);

  const prevButton = () => {
    const prevDate = previous(reservationDate);
    setReservationDate(prevDate)
  }

  const todayButton = () => {
    setReservationDate(today());
  }

  const nextButton = () => {
    const nextDate = next(reservationDate);
    setReservationDate(nextDate)
  }


  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={reservationsError} />
      <div className="row">
        <div>
          <button id="previous" name="previous" onClick={prevButton}>Previous</button>        
        </div>
        <div>
          <button id="today" name="today" onClick={todayButton}>Today</button>        
        </div>
        <div>
          <button id="next" name="next" onClick={nextButton}>Next</button>        
        </div>
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {reservationDate}</h4>
      </div>
      <div>
        <ReservationList reservations={reservations} />  
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <div>
      <TableList />
      </div>
    </main>
  );
}

export default Dashboard;
