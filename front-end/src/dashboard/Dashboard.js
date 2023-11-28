import React, { useEffect, useState } from "react";
import { useHistory} from "react-router-dom";
import { listReservations, listTables, deleteTableSeat } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import NavButtons from "./NavButtons";
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
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date);
  const history = useHistory();

    useEffect(() => {

    const abortController = new AbortController();

    async function loadReservations(date, abortController) {
      
      try{
        const result = await listReservations({date}, abortController.signal);
        setReservations(result)
      } catch (error){
        setReservationsError(error)
      }
    }

    async function loadTables(date, abortController) {
    
      try{
        const result = await listTables({date}, abortController.signal);
        setTables(result)
      } catch (error){
        setReservationsError(error)
      }
    }

    setReservationsError(null);
    loadReservations(reservationDate, abortController);
    loadTables(reservationDate, abortController);

    return () => abortController.abort();
  }, [reservationDate]);


  // define event actions for update
  const finishTableEvent = (table_id) => {
    const abortController = new AbortController();

    // save updated table objection with reservation
    try{
      deleteTableSeat(table_id, abortController.signal)
    } catch (error){
      setReservationsError(error)
    }

    return () => {
      abortController.abort();
    };
  };

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
 
  const finishTableClick = (event) => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
      const element = event.target;
      const id = element.getAttribute("data-table-id-finish");
      finishTableEvent(id);
      window.location.reload()
      } 
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={reservationsError} />
        <NavButtons prevClick={prevButton} todayClick={todayButton} nextClick={nextButton} />
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
      <TableList tables={tables} finishTableHandler={finishTableClick}/>
      </div>
    </main>
  );
}

export default Dashboard;
