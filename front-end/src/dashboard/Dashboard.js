import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { listReservations, listTables, deleteTableSeat } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import NavButtons from "./NavButtons";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  // get date inputs from lcoation.state and query param.
  // query param assumes only 1 param
  const { state, search } = useLocation();
  const qTest = search.indexOf("date=")
  const qDate = (qTest > -1) ? search.substring(search.indexOf("date=") + 5) : "";

  // reset date var from state variable if defined.
  date = getDateParam(date, qDate, state);
  const [reservationDate, setReservationDate] = useState(date);

  useEffect(() => {
    const abortController = new AbortController();

    setReservationsError(null);
    loadReservations(reservationDate, abortController);
    loadTables(abortController);

    return () => abortController.abort();
  }, [reservationDate]);

  async function loadReservations(date, abortController) {
    try {
      const result = await listReservations({ date }, abortController.signal);

      const filtered = result.filter(
        (reservation) =>
          reservation.status === "booked" || reservation.status === "seated"
      );

      setReservations(filtered);
    } catch (error) {
      setReservationsError(error.message);
    }
  }

  async function loadTables(abortController) {
    try {
      const result = await listTables(abortController.signal);
      setTables(result);
    } catch (error) {
      setReservationsError(error.message);
    }
  }

  // define event actions for FINISH table or CANCEL reservation
  const closeReservationEvent = (reservation_id, table_id, closeStatus) => {
    const abortController = new AbortController();

    // remove reservation from table entry
    const tablePromise = deleteTableSeat(
      reservation_id,
      table_id,
      closeStatus,
      abortController.signal
    )
      .then((tableResult) => {
        loadTables(abortController);
        loadReservations(reservationDate, abortController);
      })
      .catch((error) => {
        console.log(`Error in Close Reservation data load. Error: ${error.message}` );
        setReservationsError(error.message);
      })

    return () => {
      abortController.abort();
    };
  };

  const prevButton = () => {
    const prevDate = previous(reservationDate);
    setReservationDate(prevDate);
  };

  const todayButton = () => {
    setReservationDate(today());
  };

  const nextButton = () => {
    const nextDate = next(reservationDate);
    setReservationDate(nextDate);
  };

  const finishTableClick = (event) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const element = event.target;
      const table_id = element.getAttribute("data-table-id-finish");
      const reservation_id = element.getAttribute("data-reservation-id-finish");
      closeReservationEvent(reservation_id, table_id, "finished");
    }
  };

  const cancelReservationClick = (event) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const element = event.target;
      const reservation_id = element.getAttribute("data-reservation-id-cancel");
      const table_id = element.getAttribute("data-table-id-cancel");
      closeReservationEvent(reservation_id, table_id, "cancelled");
    }
  };

  // determine input value for date init
  function getDateParam(propDate, qDate, state) {
    if (qDate) {
      return qDate;
    } else {
      if (state !== undefined) {
        return state.date;
      } else {
        return propDate;
      }
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={reservationsError} />
      <NavButtons
        prevClick={prevButton}
        todayClick={todayButton}
        nextClick={nextButton}
      />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {reservationDate}</h4>
      </div>
      <div>
        <ReservationList
          reservations={reservations}
          cancelHandler={cancelReservationClick}
        />
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <div>
        <TableList tables={tables} finishTableHandler={finishTableClick} />
      </div>
    </main>
  );
}

export default Dashboard;
