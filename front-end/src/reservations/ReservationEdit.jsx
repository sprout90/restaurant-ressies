import React, { useState, useEffect } from "react";
import { useParams, useRouteMatch, useHistory } from "react-router-dom";
import {
  readReservation,
  createReservation,
  updateReservation,
  getBlackoutDay,
  getReservationStartTime,
  getReservationEndTime,
} from "../utils/api";
import {
  today,
  dayOfWeek,
  lessThanNow,
  lessThanDefinedTime,
  greaterThanDefinedTime,
  formatAsDate,
  formatAsTime,
} from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationEdit() {
  const { reservationId } = useParams();
  const { path } = useRouteMatch();
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(undefined);
  const [blackoutDay, setBlackoutDay] = useState(undefined);

  // define inital form state object
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: today(),
    reservation_time: "",
    people: 1,
  };
  const [formData, setFormData] = useState({ ...initialFormState });

  // load reservation for edit
  useEffect(() => {
    const abortController = new AbortController();

    function LoadReservation() {
      const reservationPromise = readReservation(
        reservationId,
        abortController.signal
      );
      reservationPromise
        .then((result) => {
          const reservation = {
            reservation_id: result.reservation_id,
            first_name: result.first_name,
            last_name: result.last_name,
            mobile_number: result.mobile_number,
            reservation_date: formatAsDate(result.reservation_date),
            reservation_time: formatAsTime(result.reservation_time),
            people: result.people,
          };
          setFormData(reservation);
        })
        .catch(setReservationsError);
    }

    // load Reservation if id defined
    if (reservationId) {
      LoadReservation();
    }

    // retrieve blackout day from config for validation
    setBlackoutDay(getBlackoutDay());

    return () => {
      abortController.abort();
    };
  }, [reservationId]);

  let title;
  if (path === "/reservations/new") {
    title = "Create Reservation";
  } else {
    title = "Edit Reservation";
  }

  // define event actions for create
  const createReservationEvent = (newReservation) => {
    newReservation.people = parseInt(newReservation.people);
    const abortController = new AbortController();

    const reservationPromise = createReservation(
      newReservation,
      abortController.signal
    );
    reservationPromise
      .then((result) => {
        // add new reservation (with id) to end of list, and set state
        // newReservation.id = result.id;
        gotoDashboard();
      })
      .catch(setReservationsError);

    return () => {
      abortController.abort();
    };
  };

  // define event actions for update
  const saveReservationEvent = (saveReservation) => {
    saveReservation.people = parseInt(saveReservation.people);
    const abortController = new AbortController();

    const reservationPromise = updateReservation(
      saveReservation,
      abortController.signal
    );
    reservationPromise
      .then((result) => {
        gotoDashboard();
      })
      .catch(setReservationsError);

    return () => {
      abortController.abort();
    };
  };

  // define event handlers for field-level change, and form submit
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const cancelButton = () => {
    gotoDashboard();
  };

  function gotoDashboard() {
    const url = "/dashboard";
    const location = {
      pathname: url,
      search: "",
      state: {
        date: formData.reservation_date,
      },
    };
    history.push(location);
  }

  function validateForm(formData) {
    let validForm = true;
    const errorList = [];

    // test for blackout day reservation
    const formDayOfWeek = dayOfWeek(formData.reservation_date);
    if (blackoutDay === formDayOfWeek) {
      const error = {
        name: "Backout Day reservation error",
        message: `Reservations cannot be scheduled on ${blackoutDay}. Restaurant is closed.`,
      };
      errorList.push(error);
      validForm = false;
    }

    // test for non-operating hours reservation
    const start = getReservationStartTime();
    const end = getReservationEndTime();

    const validStartTime = `${start[0]}:${start[1]}`;
    const validEndTime = `${end[0]}:${end[1]}`;
    const inputTime = formData.reservation_time;

    if (
      lessThanDefinedTime(inputTime, validStartTime) ||
      greaterThanDefinedTime(inputTime, validEndTime)
    ) {
      const error = {
        name: "Time reservation error",
        message: `Reservations cannot be scheduled before ${validStartTime} or after ${validEndTime}.`,
      };
      errorList.push(error);
      validForm = false;
    }

    // test for reservation date & time that is less than now
    if (lessThanNow(formData.reservation_date, formData.reservation_time)) {
      const error = {
        name: "Day & Time reservation error",
        message: `Reservations must be scheduled in the future.`,
      };
      errorList.push(error);
      validForm = false;
    }

    if (validForm === false) {
      setReservationsError(errorList);
    }

    return validForm;
  }

  return (
    <div>
      <h1>{title}</h1>
      <ErrorAlert error={reservationsError} />
      <hr />
      <form
        name="create"
        onSubmit={(event) => {
          event.preventDefault();
          if (!reservationId) {
            if (validateForm(formData) === true) {
              createReservationEvent(formData);
            }
          } else {
            if (validateForm(formData) === true) {
              saveReservationEvent(formData);
            }
          }
        }}
      >
        <label htmlFor="first_name">
          First Name
          <br />
          <input
            id="first_name"
            name="first_name"
            type="text"
            placeholder="First Name"
            onChange={handleChange}
            value={formData.first_name}
            required={true}
          />
        </label>
        <br />
        <label htmlFor="last_name">
          Last Name
          <br />
          <input
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
            value={formData.last_name}
            required={true}
          />
        </label>
        <br />
        <label htmlFor="mobile_number">
          Mobile Number
          <br />
          <input
            id="mobile_number"
            name="mobile_number"
            type="text"
            placeholder="555-555-5555"
            onChange={handleChange}
            value={formData.mobile_number}
            required={true}
          />
        </label>
        <br />
        <label htmlFor="reservation_date">
          Reservation Date
          <br />
          <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            placeholder="YYYY-MM-DD"
            onChange={handleChange}
            value={formData.reservation_date}
            required={true}
          />
        </label>
        <br />
        <label htmlFor="reservation_time">
          Reservation Time
          <br />
          <input
            id="reservation_time"
            name="reservation_time"
            type="time"
            placeholder="HH:MM"
            onChange={handleChange}
            value={formData.reservation_time}
            required={true}
          />
        </label>
        <br />
        <label htmlFor="people">
          People
          <br />
          <input
            id="people"
            name="people"
            type="number"
            placeholder="People in party"
            onChange={handleChange}
            value={formData.people}
            min="1"
            required={true}
          />
        </label>
        <br />
        <div>
          <button onClick={cancelButton} className="btn btn-primary">
            Cancel
          </button>
          &nbsp;
          <button type="submit" className="btn btn-secondary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationEdit;
