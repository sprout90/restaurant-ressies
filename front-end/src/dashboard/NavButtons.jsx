import React from "react";

function NavButtons({prevClick, todayClick, nextClick}){
  
  
  return (
    <nav>
      <div className="container px-lg-5">
        <div className=" mx-lg-n5 d-flex flex-row-reverse">
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
  </nav>
  );
}

export default NavButtons;
