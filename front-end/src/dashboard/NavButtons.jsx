import React from "react";

function NavButtons({prevClick, todayClick, nextClick}){
  
  
  return (
  <div className="row">
    <div>
      <button id="previous" name="previous" onClick={prevClick}>Previous</button>        
    </div>
    <div>
      <button id="today" name="today" onClick={todayClick}>Today</button>        
    </div>
    <div>
      <button id="next" name="next" onClick={nextClick}>Next</button>        
    </div>
  </div>
  );
}

export default NavButtons;
