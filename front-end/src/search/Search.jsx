import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ReservationList from "../reservations/ReservationList";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState(undefined);
  const history = useHistory();

  // define inital form state object
  const initialFormState = {
    mobile_number: "",
    searchAttempted: false,
  };
  const [formData, setFormData] = useState({ ...initialFormState });

  const cancelButton = () => {
    gotoDashboard();
  };

  function gotoDashboard() {
    const url = "/dashboard";
    history.push(url);
  }

  // define event handlers for field-level change, and form submit
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  function validateForm({ table_id }) {
    let validForm = true;
    const errorList = [];

    if (validForm === false) {
      setErrors(errorList);
    }

    return validForm;
  }

  async function loadReservations() {
    const abortController = new AbortController();

    try {
      const mobile_number = formData.mobile_number;
      const result = await listReservations(
        { mobile_number },
        abortController.signal
      );

      setReservations(result);
    } catch (error) {
      setErrors(error);
    }
  }

  const renderReservationList = () => {
    if (reservations.length === 0 && formData.searchAttempted === true) {
      return (
        <p>No reservations found. Please correct phone number and try again.</p>
      );
    }

    if (formData.searchAttempted === false) {
      return null;
    } else {
      return <ReservationList reservations={reservations} />;
    }
  };

  const searchEvent = () => {
    setFormData({ ...formData, searchAttempted: true });
    loadReservations();
  };

  return (
    <div>
      <h1>Search for a Reservation</h1>
      <p>Please enter a full or partial number in the box below.</p>
      <ErrorAlert error={errors} />
      <hr />
      <form
        name="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (validateForm(formData) === true) {
            searchEvent(formData);
          }
        }}
      >
        <label htmlFor="mobile_number">
          Mobile Number
          <br />
          <input
            id="mobile_number"
            name="mobile_number"
            type="text"
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
            value={formData.mobile_number}
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
            Find
          </button>
        </div>
      </form>
      <br />
      <div>{renderReservationList()}</div>
    </div>
  );
}

export default Search;
