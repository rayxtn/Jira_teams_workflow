import React, { useState, useEffect } from 'react';

const ShiftDataComponent = () => {
    const [userShiftsData, setUserShiftsData] = useState([]); // Set up the state for user shifts data

    useEffect(() => {
      // Fetch data from the server here and update the userShiftsData state
      fetch('http://localhost:8080/api/allshifts')
        .then(response => response.json())
        .then(data => setUserShiftsData(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

  return (
    <div>
      {userShiftsData.map(item => (
        <div key={item._id}>
          <h3>Start Date: {item.startDate}</h3>
          <h3>End Date: {item.endDate}</h3>
          <div>
            {Object.keys(item.data).map(groupKey => {
              const groupData = item.data[groupKey];
              return (
                <div key={groupKey}>
                  <h4>Group Name: {groupData.groupName}</h4>
                  <div>
                    {Object.keys(groupData.users).map(userKey => {
                      const userData = groupData.users[userKey];
                      return (
                        <div key={userKey}>
                          <h5>User: {userData.displayName}</h5>
                          <p>Email: {userData.email || 'N/A'}</p>
                          <div>
                            {userData.shifts.map(shift => (
                              <div key={shift.id}>
                                <h6>Shift Name: {shift.displayName}</h6>
                                <p>Start Date: {shift.startDateTime}</p>
                                <p>End Date: {shift.endDateTime}</p>
                                <p>Notes: {shift.notes || 'No notes'}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShiftDataComponent;
