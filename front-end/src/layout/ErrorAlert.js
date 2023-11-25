import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {

  if (error) {

    if (Array.isArray(error) === false){
      // return single error message
      return (
        <div className="alert alert-danger m-2">Error: {error.message}</div>
      );
    }
    
    else {
      console.log(error)
      // return one or more errors from error.map
      return (
        <div>
          <div className="alert alert-danger m-2">One or more errors found, see below</div>
          <div>
            <ul>
            {error.map((item, index) => <div><li>{item.message}</li></div>)}
            </ul>
          </div>
        </div>
        )
    } 
} else {
  // return empty span tag for no errors as placeholder.
    return (null);    
  }
}

export default ErrorAlert;
