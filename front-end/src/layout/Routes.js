import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationEdit from "../reservations/ReservationEdit";
import ReservationSeat from "../reservations/ReservationSeat";
import Search from "../search/Search";
import TableEdit from "../tables/TableEdit";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */



function Routes() {  

  return (
    <Switch>
     <Route path="/search" >
        <Search />
     </Route>
     <Route path="/tables/new" >
        <TableEdit />
      </Route>
     <Route path="/reservations/new" >
        <ReservationEdit />
     </Route>
     <Route path="/reservations/:reservationId/edit" >
        <ReservationEdit />
     </Route>
     <Route path="/reservations/:reservationId/seat" >
        <ReservationSeat />
     </Route>
     <Route exact={true} path="/reservations">
       <Redirect to={"/dashboard"} />
     </Route>
     <Route path="/dashboard">
       <Dashboard date={today()}/>
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
