import React, {useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, listTables, updateTableSeat } from "../utils/api"
import { formatAsDate, formatAsTime } from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat(){
  const {reservationId} = useParams();
  const [reservation_id, setReservation_Id] = useState(reservationId);
  const history = useHistory();
  const [reservation, setReservation] = useState(undefined)
  const [tables, setTables] = useState([])
  const [errors, setErrors] = useState(undefined)

    // define inital form state object 
    const initialFormState = {
      table_id: -1
    }; 
  const [formData, setFormData] = useState( {...initialFormState })

  // load reservation object, and available tables for reservation date.
  useEffect(() => {

    const abortController = new AbortController();

      async function LoadReservation(){

        try{
          await readReservation(reservation_id, abortController.signal)
          .then((result)=> {
            result.reservation_date = formatAsDate(result.reservation_date);
            setReservation(result);
            loadTables(result.reservation_date, abortController);}
            )

        } catch (error){
          setErrors(error)
        }
      }
    
      async function loadTables(date, abortController) {
    
        try{
          const result = await listTables({date}, abortController.signal);
          const filtered = result.filter((table) => ((table.reservation_date === null) && (table.reservation_id === null  )))

          setTables(filtered)
        } catch (error){
          setErrors(error)
        }
      }

      setErrors(null);
      LoadReservation();

    
    return () => {
      abortController.abort();
    };
  }, [reservation_id]);


  function validCapacity(capacity){
 
    // compare table capacity to reservation people
    if (parseInt(capacity) >= parseInt(reservation.people)){
      return true;
    }  else {
      return false;
    }
  }

  function validRequiredTable(tableId){
    if(tableId > 0){
      return true
    } else {
      return false;
    }
  }

  // define event handlers for field-level change, and form submit
  const handleChange = ({ target }) => { 
    setFormData({ ...formData, [target.name]: target.value, 
    });  
  };

  const cancelButton = () => {
    gotoDashboard();
  }

  function gotoDashboard(){
    const url = "/dashboard"
    const location = {
      pathname: url,
      search: "",
      state: {
        date: reservation.reservation_date
      }
    }
    history.push(location);
  }

 
  // define event action for table save
  const saveSeatEvent = ({table_id}) => {
    const abortController = new AbortController();

    // set table object to only include reservation_id 
    const saveTable = {reservation_id: reservation_id};

    // save updated table object with reservation
    try{
      const tablePromise = updateTableSeat(table_id, saveTable, abortController.signal);
      tablePromise
      .then((tableResult) =>  gotoDashboard() )
    } catch(error){
      setErrors(error);
    }

    return () => {
      abortController.abort();
    };
  };

  function validateForm({table_id}){
    let validForm = true;
    const errorList = [];

    // get table from useState array
    const table = tables.find((table) => parseInt(table_id) === table.table_id);

    if (validRequiredTable(table_id) === false) {
      const error = {name: "Table selection required",
      message: `A table must be selected to seat a reservation.`}
      errorList.push(error)
      setErrors(errorList)
      return false;
    }

    if (validCapacity(table.capacity) === false) {
      const error = {name: "Table capacity error",
      message: `Reservation cannot exceed the table capacity. Table capacity: ${table.capacity}`}
      errorList.push(error)
      validForm = false;
    }

    if (validForm === false){
      setErrors(errorList)
    }

    return validForm;
  }

  const renderSelectControl = () => {
      if (tables.length !== 0){
        return <div>
        <label htmlFor="type">Table:&nbsp;</label>
          <select 
          id="table_id" 
          name="table_id" 
          required={true}
          onChange={handleChange}
          value={formData.table_id} 
          >
            <option value="0">Select a Table</option>
            {tables.map((table) => <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>)}
        </select>
      </div>
    } else {
      return <p><b>No tables available for seating.</b></p>
    }
  }

  const renderSubmitBtn = () => {
    if (tables.length !== 0){
      return <button type="submit" className="btn btn-secondary">Submit</button>
    } else {
      return null;
    }
  }

  if (!(reservation)){
    return (
      <div>
        <h4>Loading Page... </h4>
      </div>
    ); 
  } else {
    return (
      <div>
        <h1>Seat a Reservation</h1>
        <ErrorAlert error={errors} />
        <hr/>
        <div>
          <p>Reservation For: {reservation.first_name} {reservation.last_name}</p>
          <p>Party of: {reservation.people}</p>
          <p>On date: {formatAsDate(reservation.reservation_date)} {formatAsTime(reservation.reservation_time)}</p>
        </div>
        <form name="update" onSubmit={(event) => {
            event.preventDefault();
            if (validateForm(formData) === true){
              saveSeatEvent(formData);
            }
          } } >
            {renderSelectControl()}
          <br/>
          <div>
            <button onClick={cancelButton} className="btn btn-primary">Cancel</button>
            &nbsp;
            {renderSubmitBtn()}
          </div>
        </form>
      </div>
    )
  }
}

export default ReservationSeat;