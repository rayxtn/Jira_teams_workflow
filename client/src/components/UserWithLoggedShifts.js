import React, { useState, useEffect } from 'react';
import '../styles/loggedshifts.css'; // Import the CSS file

function UserShiftsDisplay() {
  const [userShiftsData, setUserShiftsData] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    // Fetch data from the server here and update the userShiftsData state
    fetch('http://localhost:8080/api/validation')
      .then(response => response.json())
      .then(data => setUserShiftsData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const toggleGroup = groupName => {
    setExpandedGroups(prevExpandedGroups => ({
      ...prevExpandedGroups,
      [groupName]: !prevExpandedGroups[groupName]
    }));
  };

  return (
    <div className="user-shifts-container">
      {Object.keys(userShiftsData).map((groupName, groupIndex) => {
        const group = userShiftsData[groupName];
        const isGroupExpanded = expandedGroups[groupName] || false;

        if (group.length > 0) {
          return (
            <div key={groupIndex} className="group-container">
              <h2
                className={`group-name ${isGroupExpanded ? 'expanded' : ''}`}
                onClick={() => toggleGroup(groupName)}
              >
                Group Name: {groupName}
              </h2>
              {isGroupExpanded && (
                <table className="shift-table">
                  <thead>
                    <tr>
                      <th>User Email</th>
                      <th>User Name</th>
                      <th>Validated Shift for this week per day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map((user, userIndex) => (
                      <tr key={userIndex}>
                        <td>{user.userEmail}</td>
                        <td>{user.userName}</td>
                        <td>
                          <ul className="shift-list">
                            {user.userLoggedShifts
                              .map((shift, shiftIndex) => (
                                <li key={shiftIndex}>
                                  {`Day of the Week: ${shift.dayOfWeek}, Total Shifts: ${shift.shifts}, Total Hours Worked: ${shift.totalHours}`}
                                </li>
                              ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
