import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ShiftsByWeekComponent.css'; // Import your CSS file

const ShiftsByWeekComponent = () => {
  const [shiftsByWeek, setShiftsByWeek] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function fetchShiftsByWeek() {
      try {
        const response = await axios.get('http://localhost:8080/api/getshifts'); 
        setShiftsByWeek(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchShiftsByWeek();
  }, []);

  const handleGroupClick = (groupKey) => {
    if (selectedGroup === groupKey) {
      setSelectedGroup(null);
    } else {
      setSelectedGroup(groupKey);
      setSelectedUser(null);
    }
  };

  const handleUserClick = (userKey) => {
    if (selectedUser === userKey) {
      setSelectedUser(null);
    } else {
      setSelectedUser(userKey);
    }
  };

  return (
    <div className="page-container">
    <div className="App">
      <h1 className="header">Shifts</h1>
      <div className="shifts-container">
        {shiftsByWeek.map(weekData => (
          <div key={weekData.startDate} className="week-container">
            <h2 className="week-title">Week: {weekData.startDate} to {weekData.endDate}</h2>
            {Object.keys(weekData.data).map(groupKey => (
              <div key={groupKey} className="group-container">
                <h3 className="group-title" onClick={() => handleGroupClick(groupKey)}>Group: {weekData.data[groupKey].groupName}</h3>
                {selectedGroup === groupKey && (
                  <div className="users-container">
                    {Object.keys(weekData.data[groupKey].users).map(userKey => (
                      <div key={userKey} className="user-container">
                        <h4 className="user-title" onClick={() => handleUserClick(userKey)}>User: {weekData.data[groupKey].users[userKey].displayName}</h4>
                        {selectedUser === userKey && (
                          <div className="shifts-container">
                          <p>Email: {weekData.data[groupKey].users[userKey].email}</p>
                            {weekData.data[groupKey].users[userKey].shifts.map(shift => (
                              <div key={shift.id} className="shift-container">
                                <p>Shift ID: {shift.id}</p>
                                <p>Display shift type : {shift.displayName}</p>
                                <p>Start Date: {shift.startDateTime}</p>
                                <p>End Date: {shift.endDateTime}</p>
                                {/* Display other shift details */}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ShiftsByWeekComponent;
