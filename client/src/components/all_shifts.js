import React, { useState, useEffect } from 'react';
import '../styles/allshifts.css';
import ShiftsWeek from './weekshifts'

const formattedDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const ShiftDataComponent = () => {
  const [userShiftsData, setUserShiftsData] = useState([]);
  const [showShiftsWeek, setShowShiftsWeek] = useState(false);

  useEffect(() => {
    setLoading(true); // Set loading to true when starting data fetching
    fetch('http://localhost:8080/api/allshifts')
      .then(response => response.json())
      .then(data => {
        setUserShiftsData(data);
        setLoading(false); // Set loading to false when data is loaded
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false on error as well
      });
  }, []);
  const [loading, setLoading] = useState(true);


  const toggleExpand = (index) => {
    const updatedData = [...userShiftsData];
    updatedData[index].expanded = !updatedData[index].expanded;
    setUserShiftsData(updatedData);
  };

  const toggleGroupExpand = (groupKey) => {
    const updatedData = userShiftsData.map(item => ({
      ...item,
      data: {
        ...item.data,
        [groupKey]: {
          ...item.data[groupKey],
          expanded: !item.data[groupKey].expanded,
        },
      },
    }));
    setUserShiftsData(updatedData);
  };

  const handleDelete = (index) => {
    // You can send a request to your backend to delete the data
    // For example:
    // fetch(`http://localhost:8080/api/delete/${userShiftsData[index]._id}`, {
    //   method: 'DELETE'
    // })
    // .then(response => {
    //   // Handle success or error
    // })
  };

  const handleShowShiftsWeek = () => {
    setShowShiftsWeek(!showShiftsWeek);
  };

  return (
    <div className="shift-container">
    <div className="centered-button">
      <button onClick={handleShowShiftsWeek}>
        {showShiftsWeek ? 'Hide Shifts data' : 'click here for the current week Shifts'}
      </button>
    </div>

    {showShiftsWeek && <ShiftsWeek />}
    <p>Shifts by week Archive</p><br></br>

    {loading ? ( // Conditionally render the circular progress bar when loading is true
      <div className="progress-bar">
        <div className="loader"></div>
      </div>
    ) : (
      <table className="shift-table">
        <thead>
          <tr>
            <th>Start Of Week</th>
            <th>End Of Week</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userShiftsData.map((item, index) => (
            <React.Fragment key={item._id}>
              <tr>
                <td>{formattedDate(item.startDate)}</td>
                <td>{formattedDate(item.endDate)}</td>
                <td>
                  <button onClick={() => toggleExpand(index)}>
                    {item.expanded ? 'Collapse' : 'Expand'}
                  </button>
                  <button className='red-b' onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </td>
              </tr>
              {item.expanded && (
                <>
                  {Object.keys(item.data).map(groupKey => (
                    <React.Fragment key={groupKey}>
                      <tr>
                        <td colSpan="2">
                          <button onClick={() => toggleGroupExpand(groupKey)}>
                            {item.data[groupKey].expanded ? 'Collapse' : 'Expand'}
                          </button>
                          Group Name: {item.data[groupKey].groupName}
                        </td>
                        <td>
                          {/* You can add more actions for the expanded groups here */}
                        </td>
                      </tr>
                      {item.data[groupKey].expanded && item.data[groupKey].users && (
                        Object.keys(item.data[groupKey].users).map(userId => {
                          const user = item.data[groupKey].users[userId];
                          return (
                            <tr key={userId}>
                              <td colSpan="3">
                                User: {user.displayName}
                                {user.shifts && Object.keys(user.shifts).map(shiftId => {
                                  const shift = user.shifts[shiftId];
                                  return (
                                    <div key={shiftId}>
                                      Shift ID: {shift.id}
                                      Start Date Time: {shift.startDateTime}
                                      End Date Time: {shift.endDateTime}
                                    </div>
                                  );
                                })}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </React.Fragment>
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>)}
    </div>
  );
};

export default ShiftDataComponent;
