import React from "react";

function NavButtons({prevClick, todayClick, nextClick}){
  
  /* Display prev, today, and next reservation date buttons for Dashboard
    uses bootstrap button group class
  */
  return (
    <nav>
      <div className="btn-group justify-content-end align-middle ">
        <button id="previous" name="previous" className="btn btn-primary" onClick={prevClick}>Previous</button>        
        <button id="today" name="today" className="btn btn-primary" onClick={todayClick}>Today</button>        
        <button id="next" name="next" className="btn btn-primary" onClick={nextClick}>Next</button>        
      </div>
  </nav>
  );
}

export default NavButtons;
