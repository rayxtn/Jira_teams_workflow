import React, { useState, useEffect } from 'react';
import '../styles/loggedshifts.css'; // Import the CSS file
import { FaTrash } from 'react-icons/fa'; // Import the trash icon

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

  const handleDeleteUser = (groupName, userEmail) => {
    // Use window.confirm to show a confirmation dialog
    const shouldDelete = window.confirm("Are you sure you want to delete this user?");

    if (shouldDelete) {
      // Create a copy of userShiftsData
      const updatedUserShiftsData = { ...userShiftsData };

      // Remove the user from the data
      delete updatedUserShiftsData[groupName][userEmail];

      // Update the state with the modified data
      setUserShiftsData(updatedUserShiftsData);
    }
  };

  return (
    <div className="user-shifts-container">
      {Object.keys(userShiftsData).map((groupName, groupIndex) => {
        const group = userShiftsData[groupName];
        const isGroupExpanded = expandedGroups[groupName] || false;

        const nonEmptyUsers = Object.keys(group).filter(userEmail => group[userEmail].length > 0);

        if (nonEmptyUsers.length === 0) {
          return null; // Skip rendering groups with no users having shifts
        }

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
                    <th>Shifts</th>
                    <th>Validation Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {nonEmptyUsers.map((userEmail, userIndex) => {
                    const user = group[userEmail];
                    return (
                      <tr key={userIndex}>
                        <td>{userEmail}</td>
                        <td>{user[0].userName}</td>
                        <td>
                          <ul className="shift-list">
                            {user.map((shift, shiftIndex) => (
                              <li key={shiftIndex}>
                                {`Day: ${shift.startDateTime}, || ${shift.shiftdisplayName}, || ${shift.validated}`}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          {user.every(shift => shift.validated) ? (
                            <span className="green-text">User validated all the mentioned shifts</span>
                          ) : (
                            <span className="red-text">User did not validate all shifts</span>
                          )}
                        </td>
                        <td>
                          <FaTrash
                            onClick={() => handleDeleteUser(groupName, userEmail)}
                            size={24} // You can adjust the size as needed
                            className="delete-icon"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UserShiftsDisplay;
