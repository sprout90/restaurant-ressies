import React, { useState, useEffect } from "react";
import { useParams, useRouteMatch, useHistory } from "react-router-dom";
import { readTable, createTable, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TableEdit() {
  const { tableId } = useParams();
  const { path } = useRouteMatch();
  const history = useHistory();
  const [tablesError, setTablesError] = useState(undefined);

  // define inital form state object
  const initialFormState = {
    table_name: "",
    capacity: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });

  // Load page from readTable() rest call when tableId is defined
  useEffect(() => {
    const abortController = new AbortController();

    function LoadTable() {
      const tablePromise = readTable(tableId, abortController.signal);
      tablePromise
        .then((result) => {
          const table = {
            id: result.table_id,
            table_name: result.table_name,
            capacity: result.capacity,
          };
          setFormData(table);
        })
        .catch(setTablesError);
    }

    // load Reservation if id defined
    if (tableId) {
      LoadTable();
    }

    return () => {
      abortController.abort();
    };
  }, [tableId]);

  // determine title display based on path
  let title;
  if (path === "/tables/new") {
    title = "Create Reservation Table";
  } else {
    title = "Edit Reservation Table";
  }

  // define event handlers for field-level change, and form submit
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const cancelButton = () => {
    history.goBack();
  };

  // Save table create to database using REST call
  // in createTable(), then return to Dashboard
  // on error, stay on page and display error
  const createTableEvent = (newTable) => {
    newTable.capacity = parseInt(newTable.capacity);
    const abortController = new AbortController();

    const tablePromise = createTable(newTable, abortController.signal);
    tablePromise
      .then((result) => {
        // add new table (with id) to end of list, and set state
        // newTable.table_id = result.id;
        const url = `/dashboard`;
        history.push(url);
      })
      .catch(setTablesError);

    return () => {
      abortController.abort();
    };
  };

  // Save table edits to database using REST call
  // in updateTable(), then return to Dashboard
  // on error, stay on page and display error
  const saveTableEvent = (saveTable) => {
    saveTable.capacity = parseInt(saveTable.capacity);
    const abortController = new AbortController();

    const tablePromise = updateTable(saveTable, abortController.signal);
    tablePromise
      .then((result) => {
        const url = `/dashboard`;
        history.push(url);
      })
      .catch(setTablesError);

    return () => {
      abortController.abort();
    };
  };

  /* form validation placeholder logic from edit form template.
    currently called but does nothing.  Will be updated to include
    addition validation as needed */
  function validateForm(formData) {
    let validForm = true;
    const errorList = [];

    if (validForm === false) {
      setTablesError(errorList);
    }

    return validForm;
  }

  return (
    <div>
      <h1>{title}</h1>
      <ErrorAlert error={tablesError} />
      <hr />
      <form
        name="create"
        onSubmit={(event) => {
          event.preventDefault();
          if (!tableId) {
            if (validateForm(formData) === true) {
              createTableEvent(formData);
            }
          } else {
            if (validateForm(formData) === true) {
              saveTableEvent(formData);
            }
          }
        }}
      >
        <div className="input-group">
          <label htmlFor="table_name">
            Table Name
            <br />
            <input
              id="table_name"
              name="table_name"
              type="text"
              placeholder="2 character minimum"
              className="form-control"
              onChange={handleChange}
              value={formData.table_name}
              minLength="2"
              required={true}
            />
          </label>
        </div>
        <div className="input-group">
          <label htmlFor="capacity">
            Capacity
            <br />
            <input
              id="capacity"
              name="capacity"
              type="number"
              placeholder="Table capacity"
              className="form-control"
              onChange={handleChange}
              value={formData.capacity}
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default TableEdit;
