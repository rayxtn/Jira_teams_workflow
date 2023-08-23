import React, { useState, useEffect } from 'react';
import '../styles/UserShiftsDisplay.css'; // Import the CSS file


function Bonusdata() {
  const [userShiftsData, setUserShiftsData] = useState([]);

  useEffect(() => {
    // Fetch data from the server here and update the userShiftsData state
    fetch('http://localhost:8080/api/validation')
      .then(response => response.json())
      .then(data => setUserShiftsData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="user-shifts-container">
      <h2>Users Who logged their Shifts this week :</h2>
      <table className="user-shifts-table">
        <thead>
          <tr>
            <th>User Email</th>
            <th>User Logged Shifts</th>
          </tr>
        </thead>
        <tbody>
          {userShiftsData.map((userData, index) => (
            <tr key={index}>
              <td>{userData.userEmail}</td>
              <td>
                <ul className="user-shifts-list">
                  {userData.userLoggedShifts.map((shift, shiftIndex) => (
                    <li className="shift-item" key={shiftIndex}>
                      <span className="shift-date">{shift.startDateTime}</span>
                      <span className="shift-name">{shift.displayName}</span>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
                  }
export default Bonusdata;
