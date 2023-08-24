import React, { useState, useEffect } from 'react';
import '../styles/UserShiftsDisplay.css'; // Import the CSS file

function UserShiftsDisplay() {
  const [userShiftsData, setUserShiftsData] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    // Fetch data from the server here and update the userShiftsData state
    fetch('http://localhost:8080/api/bonusdata')
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
        const isGroupExpanded = expandedGroups[groupName];
        if (group.length > 0) {
          return (
            <div key={groupIndex} className="group-container">
              <h2 className="group-name" onClick={() => toggleGroup(groupName)}>
                Group Name: {groupName}
              </h2>
              {isGroupExpanded && (
                <table className="shift-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Shift Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map((user, userIndex) => (
                      <tr key={userIndex}>
                        <td>{user.userEmail}</td>
                        <td>
                          <ul className="shift-list">
                            {user.userLoggedShifts.map((shift, shiftIndex) => (
                              <li key={shiftIndex}>{shift.startDateTime}</li>
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
