import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
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
  const history = useHistory();

  // get date inputs from lcoation.state and query param.
  // query param assumes only 1 param
  const { state, search } = useLocation();
  const qTest = search.indexOf("date=");
  const qDate = qTest > -1 ? search.substring(search.indexOf("date=") + 5) : "";

  // reset date var from state variable if defined.
  date = getDateParam(date, qDate, state);
  const [reservationDate, setReservationDate] = useState(date);

  // Manage the Change Reservation Date event,
  // by reloading the page from the database
  useEffect(() => {
    const abortController = new AbortController();

    setReservationsError(null);
    loadReservations(reservationDate, abortController);
    loadTables(abortController);

    return () => abortController.abort();
  }, [reservationDate]);

  // Load Reservations with async using a REST API call
  // only display reservations with booked, or seated status
  // any errors caught are displayed via ReservationsError state variable
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

  // Load Tables with async using a REST API call
  // any errors caught are displayed via ReservationsError state variable
  async function loadTables(abortController) {
    try {
      const result = await listTables(abortController.signal);
      setTables(result);
    } catch (error) {
      setReservationsError(error.message);
    }
  }

  // define event actions for FINISH table or CANCEL reservation
  // Call the deleteTableSeat REST api to remove
  // reservation_id from tables (table) and set reservation table status
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
        // reload page from REST calls
        loadTables(abortController);
        loadReservations(reservationDate, abortController);
      })
      .catch((error) => {
        console.log(
          `Error in Close Reservation data load. Error: ${error.message}`
        );
        setReservationsError(error.message);
      });

    return () => {
      abortController.abort();
    };
  };

  // Goto prev date, and set ReservationDate state variable.
  // Reservation date change triggests useEffect event
  // does not cause ?date QueryString or Prop date var to change.
  const prevButton = () => {
    const prevDate = previous(reservationDate);
    setReservationDate(prevDate);
  };

  // Goto today's date, and set ReservationDate state variable.
  // Reservation date change triggests useEffect event
  // does not cause ?date QueryString or Prop date var to change.
  const todayButton = () => {
    setReservationDate(today());
  };

  // Goto next date, and set ReservationDate state variable.
  // Reservation date change triggests useEffect event
  // does not cause ?date QueryString or Prop date var to change.
  const nextButton = () => {
    const nextDate = next(reservationDate);
    setReservationDate(nextDate);
  };

  const tableAddButton = () => {
    const url = "/tables/new";
    history.push(url);
  }

  // catch the Finish table click event, and display confirmation popup.
  // If yes, call perform actions in closeReservationEvent
  // If no, cancel and return to page -- doing nothing
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

  // catch the cancel reservation click event, and display confirmation popup.
  // If yes, call perform actions in closeReservationEvent
  // If no, cancel and return to page -- doing nothing
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

  // Logic used to determine which input method to
  // derive the reservation date var that drives the page
  // qDate takes priority if defined.
  // propDate only used on initial load from Layout.js
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

  const renderReservationList = () => {
    if (reservations.length === 0) {
      return <p>No reservations found for selected date.</p>;
    } else {
      return ( 
        <ReservationList
          reservations={reservations}
          cancelHandler={cancelReservationClick}
        />
      );
    }
  };

  const renderTableList = () => {
    if (tables.length === 0) {
      return (
        <div><p>No tables found. Please add some. &nbsp;
            <button className="btn btn-primary" onClick={tableAddButton}>
              New Table
          </button>
          </p>
        </div>  
      )
    } else {
      return ( 
        <TableList tables={tables} finishTableHandler={finishTableClick} />
      );
    }
  };


  return (
    <main>
      {/* HEADER */}
      <section id="header">
        <h1>Dashboard</h1>
        <ErrorAlert error={reservationsError} />
        <div className="group">
          <div className="item">
            <h4 className="mt-3">Reservations for {reservationDate}</h4>
          </div>
          <div className="item">
            <NavButtons
              prevClick={prevButton}
              todayClick={todayButton}
              nextClick={nextButton}
            />
          </div>
        </div>
        <div>
          <hr />
        </div>
      </section>

      {/* RESERVATIONS */}
      <section id="reservations">
        <div>
          {renderReservationList()}
        </div>
        <div>
          <hr />
        </div>
      </section>

      {/* TABLES */}
      <section id="tables">
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Tables</h4>
        </div>
        <div>
          <hr />
        </div>
        <div>
          {renderTableList()}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
