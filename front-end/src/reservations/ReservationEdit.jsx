import React, {useState, useEffect} from "react";
import { useParams, useRouteMatch, useHistory} from "react-router-dom";
import { readReservation, getBlackoutDay, getReservationStartTime, getReservationEndTime } from "../utils/api"
import { today, dayOfWeek, lessThanNow, lessThanDefinedTime, greaterThanDefinedTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();

function ReservationEdit({createReservationEvent, saveReservationEvent }){
  const {reservationId} = useParams();
  const { path } = useRouteMatch();
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(undefined)
  const [blackoutDay, setBlackoutDay] = useState(undefined)
  

    // define inital form state object 
    const initialFormState = {
      first_name: "",
      last_name: "",
      mobile_number: "",
      reservation_date: today(),
      reservation_time: "",
      people: 1
    }; 
  const [formData, setFormData] = useState( {...initialFormState })
  console.log("reservation id ", reservationId)


  // populate primary deck and card stack properties
  useEffect(() => {

    // retrieve decks with cards, and store the DeckData arry in useState
    const abortController = new AbortController();

      function LoadReservation(){
        const reservationPromise = readReservation(reservationId, abortController.signal);
        reservationPromise.then((result) => {
          const reservation = 
            { id : result.id, 
              first_name: result.first_name,
              last_name: result.last_name,
              mobile_number: result.mobile_number,
              reservation_date: result.reservation_date,
              reservation_time: result.reservation_time,
              people: result.people};
          setFormData(reservation);   
        })
        .catch(setReservationsError);
      }
    
    // load Reservation if id defined
    if (reservationId){
      LoadReservation();
    }
    
    // retrieve blackout day from config for validation
    setBlackoutDay(getBlackoutDay())


    return () => {
      abortController.abort();
    };
  }, [reservationId]);


  let title;
  if (path === "/reservations/new"){
    title = "Create Reservation"
  } else {
    title = "Edit Reservation"
  }

  // define event handlers for field-level change, and form submit
  const handleChange = ({ target }) => { 
    setFormData({ ...formData, [target.name]: target.value, 
    });  
  };

  const cancelButton = () => {
    const url = `/dashboard`
    history.push(url);
  }


  function validateForm(formData){
    let validForm = true;
    const errorList = [];

    console.log("inside client validate" );
    // test for blackout day reservation
    const formDayOfWeek = dayOfWeek(formData.reservation_date)
    if (blackoutDay === formDayOfWeek ){
      const error = {name: "Backout Day reservation error",
                   message: `Reservations cannot be scheduled on ${blackoutDay}. Restaurant is closed.`}
      errorList.push(error)
      validForm = false;
    }
 
    // test for non-operating hours reservation
    const start = getReservationStartTime();
    const end = getReservationEndTime();

    const validStartTime = `${start[0]}:${start[1]}`;
    const validEndTime = `${end[0]}:${end[1]}`;
    const inputTime = formData.reservation_time;

    if ((lessThanDefinedTime(inputTime, validStartTime)) || (greaterThanDefinedTime(inputTime, validEndTime))){
      const error = {name: "Time reservation error",
                   message: `Reservations cannot be scheduled before ${validStartTime} or after ${validEndTime}.`}
      errorList.push(error)
      validForm = false;
    }
    
    // test for reservation date & time that is less than now
    if (lessThanNow(formData.reservation_date, formData.reservation_time)){
      const error = {name: "Day & Time reservation error",
                   message: `Reservations cannot be scheduled in the past.`}
      errorList.push(error)
      validForm = false;
    }

    if (validForm === false){
      setReservationsError(errorList)
    }

    return validForm;
  }

  return (
    <div>
      <h1>{title}</h1>
      <ErrorAlert error={reservationsError} />
      <hr/>
      <form name="create" onSubmit={(event) => {
          event.preventDefault();
          if (!(reservationId)){
            if (validateForm(formData) === true){
              createReservationEvent(formData);
            }
          } else {
            if (validateForm(formData) === true){
              saveReservationEvent(formData);
            }
          }
        } } >
          <label htmlFor="first_name">First Name<br/>
            <input 
              id="first_name" 
              name="first_name" 
              type="text" 
              placeholder="First Name"
              onChange={handleChange}
              value={formData.first_name}
              required={true} />
            </label>
          <br/>
          <label htmlFor="last_name">Last Name<br/>
            <input 
              id="last_name" 
              name="last_name" 
              type="text" 
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.last_name}
              required={true} />
            </label>
          <br/>
          <label htmlFor="mobile_number">Mobile Number<br/>
            <input 
              id="mobile_number" 
              name="mobile_number" 
              type="text" 
              placeholder="555-555-5555"
              onChange={handleChange}
              value={formData.mobile_number}
              required={true} />
            </label>
          <br/>
          <label htmlFor="reservation_date">Reservation Date<br/>
            <input 
              id="reservation_date" 
              name="reservation_date" 
              type="date" 
              placeholder="YYYY-MM-DD"
              onChange={handleChange}
              value={formData.reservation_date}
              min={today()}
              required={true} />
            </label>
          <br/>
          <label htmlFor="reservation_time">Reservation Time<br/>
            <input 
              id="reservation_time" 
              name="reservation_time" 
              type="time" 
              placeholder="HH:MM"
              onChange={handleChange}
              value={formData.reservation_time}
              required={true} />
            </label>
          <br/>
          <label htmlFor="people">People<br/>
            <input 
              id="people" 
              name="people" 
              type="number" 
              placeholder="People in party"
              onChange={handleChange}
              value={formData.people}
              min="1"  
              required={true} />
            </label>
          <br/>
          <div>
            <button onClick={cancelButton} className="btn btn-primary">Cancel</button>
            &nbsp;
            <button type="submit" className="btn btn-secondary">Submit</button>
          </div>
      </form>
    </div>
  )
}

export default ReservationEdit;

