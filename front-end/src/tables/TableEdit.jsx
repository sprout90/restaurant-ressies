import React, {useState, useEffect} from "react";
import { useParams, useRouteMatch, useHistory} from "react-router-dom";
import { readTable, createTable, updateTable } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

function TableEdit(){
  const {tableId} = useParams();
  const { path } = useRouteMatch();
  const history = useHistory();
  const [tablesError, setTablesError] = useState(undefined)

    // define inital form state object 
    const initialFormState = {
      table_name: "",
      capacity: ""
    }; 
  const [formData, setFormData] = useState( {...initialFormState })
  console.log("table id ", tableId)

  // load table object
  useEffect(() => {

    const abortController = new AbortController();

      function LoadTable(){
        const tablePromise = readTable(tableId, abortController.signal);
        tablePromise.then((result) => {
          const table = 
            { id : result.table_id, 
              table_name: result.table_name,
              capacity: result.capacity};
          setFormData(table);   
        })
        .catch(setTablesError);
      }
    
    // load Reservation if id defined
    if (tableId){
      LoadTable();
    }
    
    return () => {
      abortController.abort();
    };
  }, [tableId]);


  let title;
  if (path === "/tables/new"){
    title = "Create Reservation Table"
  } else {
    title = "Edit Reservation Table"
  }

  // define event handlers for field-level change, and form submit
  const handleChange = ({ target }) => { 
    setFormData({ ...formData, [target.name]: target.value, 
    });  
  };

  const cancelButton = () => {
    history.goBack();
  }


  // define event actions for create 
  const createTableEvent = (newTable) => {

    newTable.capacity = parseInt(newTable.capacity);
    const abortController = new AbortController(); 

    const tablePromise = createTable(newTable, abortController.signal);
      tablePromise.then((result) => {
        // add new table (with id) to end of list, and set state
        // newTable.table_id = result.id;
        const url = `/dashboard`
        history.push(url);
      })
      .catch(setTablesError);

    return () => {
      abortController.abort();
    };
  };


  // define event action for table save
  const saveTableEvent = (saveTable) => {
    saveTable.capacity = parseInt(saveTable.capacity);
    const abortController = new AbortController();

    const tablePromise = updateTable(saveTable, abortController.signal);
        tablePromise.then((result) => {
          const url = `/dashboard`
          history.push(url);
        })
        .catch(setTablesError);

    return () => {
      abortController.abort();
    };
  };

  function validateForm(formData){
    let validForm = true;
    const errorList = [];

     if (validForm === false){
      setTablesError(errorList)
    }

    return validForm;
  }

  return (
    <div>
      <h1>{title}</h1>
      <ErrorAlert error={tablesError} />
      <hr/>
      <form name="create" onSubmit={(event) => {
          event.preventDefault();
          if (!(tableId)){
            if (validateForm(formData) === true){
              createTableEvent(formData);
            }
          } else {
            if (validateForm(formData) === true){
              saveTableEvent(formData);
            }
          }
        } } >
          <label htmlFor="table_name">Table Name<br/>
            <input 
              id="table_name" 
              name="table_name" 
              type="text" 
              placeholder="2 character minimum"
              onChange={handleChange}
              value={formData.table_name}
              minLength="2"
              required={true} />
            </label> 
          <br/>
          <label htmlFor="capacity">Capacity<br/>
            <input 
              id="capacity" 
              name="capacity" 
              type="number" 
              placeholder="Table capacity"
              onChange={handleChange}
              value={formData.capacity}
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

export default TableEdit;

