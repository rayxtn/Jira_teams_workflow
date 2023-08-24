import React, { useState, useEffect } from 'react';
import '../styles/UserShiftsDisplay.css'; // Import the CSS file


function UserShiftsDisplay() {
  const [userShiftsData, setUserShiftsData] = useState([]);

  useEffect(() => {
    // Fetch data from the server here and update the userShiftsData state
    fetch('http://localhost:8080/api/validation')
      .then(response => response.json())
      .then(data => setUserShiftsData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);






  return (
    <div>
      {Object.keys(userShiftsData).map((groupName, groupIndex) => {
        const group = userShiftsData[groupName];
        if (group.length > 0) {
          return (
            <div key={groupIndex}>
              <h2>Group Name: {groupName}</h2>
              <ul>
                {group.map((user, userIndex) => (
                  <li key={userIndex}>
                    <h3>User: {user.userEmail}</h3>
                    <ul>
                      {user.userLoggedShifts.map((shift, shiftIndex) => (
                        <li key={shiftIndex}>
                          <p>Shift Date: {shift.startDateTime}</p>
                          <p>Time Spent: {shift.endDateTime}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          );
        } else {
          return null; // Do not render empty groups
        }
      })}
    </div>
  );

                  }
export default UserShiftsDisplay;
