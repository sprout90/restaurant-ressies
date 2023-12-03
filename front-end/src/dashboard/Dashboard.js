import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  listReservations,
  listTables,
  deleteTableSeat,
  updateReservationStatus,
} from "../utils/api";
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

  // location state overrides the default date set as prop
  let { state } = useLocation();

  // reset date var from state variable if defined.
  date = state !== undefined ? state.date : date;

  const [reservationDate, setReservationDate] = useState(date);

  useEffect(() => {
    const abortController = new AbortController();

    setReservationsError(null);
    loadReservations(reservationDate, abortController);
    loadTables(reservationDate, abortController);

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
      setReservationsError(error);
    }
  }

  async function loadTables(date, abortController) {
    try {
      const result = await listTables({ date }, abortController.signal);
      setTables(result);
    } catch (error) {
      setReservationsError(error);
    }
  }

  // define event actions for finish table or cancel reservation
  const closeReservationEvent = (reservation_id, table_id, closeStatus) => {
    const abortController = new AbortController();

    const saveReservation = { status: closeStatus };

    // remove reservation from table entry
    const tablePromise = deleteTableSeat(table_id, abortController.signal)
      .then((tableResult) => {
        // save updated reservation status
        const reservationPromise = updateReservationStatus(
          reservation_id,
          saveReservation,
          abortController.signal
        );
        reservationPromise.then((reservationResult) => {
          loadTables(reservationDate, abortController);
          loadReservations(reservationDate, abortController);
        });
      })
      .catch(setReservationsError);

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
