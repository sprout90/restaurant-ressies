import React from "react";

function NavButtons({prevClick, todayClick, nextClick}){
  
  
  return (
    <div className="container px-lg-5">
      <div className="row mx-lg-n5">
        <div className="col py-1 px-lg-1 border bg-light">
          <button id="previous" name="previous" className="btn btn-primary" onClick={prevClick}>Previous</button>        
        </div>
        <div className="col py-1 px-lg-1 border bg-light">
          <button id="today" name="today" className="btn btn-primary" onClick={todayClick}>Today</button>        
        </div>
        <div className="col py-1 px-lg-1 border bg-light">
          <button id="next" name="next" className="btn btn-primary" onClick={nextClick}>Next</button>        
        </div>
      </div>
  </div>
  );
}

export default NavButtons;
