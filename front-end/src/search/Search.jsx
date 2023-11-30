import React, {useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import ReservationList from "../reservations/ReservationList"
import ErrorAlert from "../layout/ErrorAlert";
import { today } from "../utils/date-time";

function Search(){

  // remember date state for dashboard
  let {date} = useParams();
  date = (date) ? date : today();
  const [reservationDate, setReservationDate] = useState(date);
  const [reservations, setReservations] = useState([])

  const [errors, setErrors] = useState(undefined)
  const history = useHistory();

  // define inital form state object 
   const initialFormState = {
      mobile_number: ""
   }; 
   const [formData, setFormData] = useState( {...initialFormState })


  const cancelButton = () => {
    gotoDashboard();
  }

  function gotoDashboard(){
    const url = "/dashboard"
    const date = `${reservationDate}`
    const location = {
      pathname: url,
      search: "",
      state: {
        date: `${reservationDate}`
      }
    }
    history.push(location);
  }

   // define event handlers for field-level change, and form submit
   const handleChange = ({ target }) => { 
    setFormData({ ...formData, [target.name]: target.value, 
    });  
  };

  function validateForm({table_id}){
    let validForm = true;
    const errorList = [];


    if (validForm === false){
      setErrors(errorList)
    }

    return validForm;
  }

  async function loadReservations() {
    
    console.log("load reservations ")
    const abortController = new AbortController(); 

    try{
      const mobile_number = formData.mobile_number;
      const result = await listReservations({mobile_number}, abortController.signal);

      console.log(result)
      setReservations(result)
      } catch (error){
        setErrors(error)
    }
  }

  const searchEvent = () => {
    console.log("in search event ")
    loadReservations();
  }

  return (
    <div>
    <h1>Search for a Reservation</h1>
    <p>Please enter a full or partial number in the box below.</p>
    <ErrorAlert error={errors} />
    <hr/>
    <form name="search" onSubmit={(event) => {
        event.preventDefault();
        if (validateForm(formData) === true){
          searchEvent(formData);
        }
      } } >
          <label htmlFor="mobile_number">Mobile Number<br/>
            <input 
              id="mobile_number" 
              name="mobile_number" 
              type="text" 
              placeholder="Enter a customer's phone number"
              onChange={handleChange}
              value={formData.mobile_number}
              required={true} />
            </label>
      <br/>
      <div>
        <button onClick={cancelButton} className="btn btn-primary">Cancel</button>
        &nbsp;
        <button type="submit" className="btn btn-secondary">Find</button>
      </div>
    </form>
    <br/>
    <div>
        <ReservationList reservations={reservations}/>
    </div>
  </div>
  )

}

export default Search;
