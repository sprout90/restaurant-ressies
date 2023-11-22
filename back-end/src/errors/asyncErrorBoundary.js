/* Purpose
   -------------
   Returns an Express handler or middleware function, 
   which is eventually called by Express in place of the delegate function.

   Parameters 
   --------------
   Delegate:  which is an async/await handler or middleware function. This function will be called by the asyncErrorBoundary.
   DefaultStatus: optional parameter that allows you to override the status code returned when delegate throws an error.
*/
function asyncErrorBoundary(delegate, defaultStatus) {
  return (request, response, next) => {

    // makes sure that the delegate function is called in a promise chain. 
    // Using Promise.resolve() to call delegate means that the value returned is 
    // guaranteed to have a catch() method, even if delegate isn't an async function.
    Promise.resolve()
      .then(() => delegate(request, response, next))

      // catch() method will default error to {} in the unlikely event that 
      // error is undefined (which will make sure that the destructuring in the next line doesn't fail).
      .catch((error = {}) => {
        const { status = defaultStatus, message = error } = error;
        next({
          status,
          message,
        });
      });
  };
}

module.exports = asyncErrorBoundary;
