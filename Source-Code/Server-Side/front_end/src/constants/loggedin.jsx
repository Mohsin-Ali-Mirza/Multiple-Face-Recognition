import React, { useState, useEffect } from 'react';
let decide;
const LoggedIn = ({ decision }) => {
  const [isLoggedIn, setLoggedIn] = useState(decision);

  useEffect(() => {
    // Update the local state when the prop changes
    decide=decision
  }, [decision]);
  console.log(decide);

  return (
    <div>
     
    </div>
  );
};
const getDecide = () => decide;

export default LoggedIn;
export {getDecide};
