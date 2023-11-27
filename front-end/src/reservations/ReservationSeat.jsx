import React, {useState, useEffect} from "react";
import { useParams, useRouteMatch, useHistory} from "react-router-dom";
import { readTable, readReservation, listTables, updateTable } from "../utils/api"
import { formatAsDate, formatAsTime } from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat(){
  const {reservationId} = useParams();
  const history = useHistory();
  const [reservation, setReservation] = useState(undefined)
  const [tables, setTables] = useState([])
  const [table, setTable] = useState(undefined)
  const [errors, setErrors] = useState(undefined)

    // define inital form state object 
    const initialFormState = {
      table_id: -1
    }; 
  const [formData, setFormData] = useState( {...initialFormState })
  console.log("reservation id ", reservationId)


  // load reservation object, and available tables for reservation date.
  useEffect(() => {

    const abortController = new AbortController();

      async function LoadReservation(){

        try{
          const result = await readReservation(reservationId, abortController.signal)
          .then((result)=> {
            console.log(result)
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
          const filtered = result.filter((table) => table.reservation_date === null )

          setTables(filtered)
        } catch (error){
          setErrors(error)
        }
      }

      setErrors(null);
      LoadReservation();

      console.log("loaded reservation ", reservation)
      console.log("loaded tables ", tables)
    
    return () => {
      abortController.abort();
    };
  }, []);


  function validCapacity(tableId){
    // load table and store in useState
    loadTable(tableId);

    // compare table capacity to reservation people
    if (table.capacity <= reservation.people){
      return true;
    } else {
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
    const url = `/dashboard`
    history.push(url);
  }

  const loadTable = (tableId) => {
    const abortController = new AbortController();

    const tablePromise = readTable(tableId, abortController.signal);
    tablePromise.then((result) => {
      const table = 
        { id : result.table_id, 
          table_name: result.table_name,
          capacity: result.capacity,
          reservation_id: result.reservation_id};
      setTable(table);   
    })
    .catch(setErrors);
  
  }

  // define event action for table save
  const saveTableEvent = () => {
    const abortController = new AbortController();

    // using table object stored in useState by validator
    setTable({...table, reservation_id: reservationId})

    // save table object with new reservation id
    const tableSavePromise = updateTable(table, abortController.signal);
    tableSavePromise.then((result) => {
      const url = `/dashboard`
      history.push(url);
    })
    .catch(setErrors);

    return () => {
      abortController.abort();
    };
  };

  function validateForm(formData){
    let validForm = true;
    const errorList = [];

    console.log("validate table id ", formData.table_id)

    if (validRequiredTable(formData.table_id) === false) {
      const error = {name: "Table selection required",
      message: `A table must be selected to seat a reservation.`}
      errorList.push(error)
      validForm = false;
    }

    if (validCapacity(formData.table_id) === false) {
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
              saveTableEvent();
            }
          } } >
          <div>
            <label htmlFor="type">Table:&nbsp;</label>
            <select 
              id="table_id" 
              name="table_id" 
              required={true}
              onChange={handleChange}
              value={formData.table_id} 
              >
                <option value="0">Select a Table</option>
                {tables.map((table) => <option key={table.table_id} value={table.table_id}>Table: {table.table_name} - Capacity: {table.capacity}</option>)}
            </select>
          </div>
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
}

export default ReservationSeat;