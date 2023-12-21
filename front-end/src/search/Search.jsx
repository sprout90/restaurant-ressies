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

  // handle the cancel button click event
  const cancelButton = () => {
    gotoDashboard();
  };

  // return to the dashboard page
  function gotoDashboard() {
    const url = "/dashboard";
    history.push(url);
  }

  // define event handlers for field-level change, and form submit
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  /*  Perform all form validation functions with exception of
      HTML validation performed on the controls themselves

      function is called, but validations have not been needed 
      This is currently a placeholder that maintains my standard form 
      validation logic.
  */
  function validateForm({ table_id }) {
    let validForm = true;
    const errorList = [];

    if (validForm === false) {
      setErrors(errorList);
    }

    return validForm;
  }

  // load reservations based on mobile number
  // input parameter.
  // Result is loaded into state variable for later display
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

  // Display the reservation list with separate logic
  // for returned reservations or empty result set
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

  // Handle the search click event
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
        <div className="input-group">
          <label htmlFor="mobile_number">
            Mobile Number
            <br />
            <input
              id="mobile_number"
              name="mobile_number"
              type="text"
              placeholder="Enter a customer's phone number"
              className="form-control"
              onChange={handleChange}
              value={formData.mobile_number}
              required={true}
            />
          </label>
        </div>
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
