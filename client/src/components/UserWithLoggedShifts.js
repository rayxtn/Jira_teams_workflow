import React, { useState, useEffect } from 'react';
import '../styles/UserShiftsDisplay.css'; // Import the CSS file

function UserShiftsDisplay() {
  const [userShiftsData, setUserShiftsData] = useState({});
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

        return (
          <div key={groupIndex} className="group-container">
            <h2
              className={`group-name ${isGroupExpanded ? 'expanded' : ''}`}
              onClick={() => toggleGroup(groupName)}
            >
              Group Name: {groupName}
            </h2>
            {isGroupExpanded && (
              <div className="user-container">
                {Object.keys(group).map((userEmail, userIndex) => {
                  const user = group[userEmail];

                  return (
                    <div key={userIndex} className="user-shifts">
                      <h3>User Email: {userEmail}</h3>
                      <ul className="shift-list">
                        {Array.isArray(user.shifts) && user.shifts.length > 0
                          ? user.shifts.map((shift, shiftIndex) => (
                              <li key={shiftIndex}>
                                <strong>Shift Name:</strong> {shift.shiftdisplayName}
                                <br />
                                <strong>Start Date:</strong> {shift.startDateTime}
                                <br />
                                <strong>Shift Note:</strong> {shift.shiftnote}
                                <br />
                                <strong>Validation Status:</strong> {shift.validated ? 'Validated' : 'Not Validated'}
                              </li>
                            ))
                          : <li>No shifts for this user.</li>
                        }
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserShiftsDisplay;
