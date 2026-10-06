import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an Error, `{ message }`, a string, or an array of those.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function errorMessage(value) {
  if (typeof value === "string") {
    return value;
  }
  return value && value.message;
}

function ErrorAlert({ error }) {
  if (error) {
    if (Array.isArray(error) === false) {
      return (
        <div className="alert alert-danger m-2">Error: {errorMessage(error)}</div>
      );
    } else {
      return (
        <div>
          <div className="alert alert-danger m-2">
            One or more errors found, see below
          </div>
          <div>
            <ul>
              {error.map((item, index) => (
                <div key={`${index}`}>
                  <li>{errorMessage(item)}</li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  } else {
    return null;
  }
}

export default ErrorAlert;
