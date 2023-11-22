import React, {useState} from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationEdit from "../reservations/ReservationEdit"
import NotFound from "./NotFound";
import { createReservation, updateReservation } from "../utils/api"

import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */



function Routes() {

  const history = useHistory();
  const [error, setError] = useState();

  // define event actions for create and delete
  const createReservationHandler = (newReservation) => {

    const abortController = new AbortController(); 

    const reservationPromise = createReservation(newReservation, abortController.signal);
      reservationPromise.then((result) => {
        // add new reservation (with id) to end of list, and set state
        // newReservation.id = result.id;
        const url = `/dashboard`
        history.push(url);
      })
      .catch(setError);

    return () => {
      abortController.abort();
    };
  };


  // define event actions for create and delete
  const saveReservationHandler = (saveReservation) => {
    const abortController = new AbortController();

    const reservationPromise = updateReservation(saveReservation, abortController.signal);
        reservationPromise.then((result) => history.goBack())
        .catch(setError);


    return () => {
      abortController.abort();
    };
  };

  return (
    <Switch>
      <Route path="/reservations/new" >
        <ReservationEdit createReservationEvent={createReservationHandler} saveReservationEvent={saveReservationHandler}/>
      </Route>
      <Route path="/reservations/:reservationId/edit" >
        <ReservationEdit createReservationEvent={createReservationHandler} saveDeckEvent={saveReservationHandler}/>
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
