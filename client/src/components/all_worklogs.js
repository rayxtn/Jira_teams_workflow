import React, { useState, useEffect } from 'react';
import WorkLogsComp from './issuesbyweek';
import '../styles/allshifts.css';
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
  const [showWorkLogs, setShowWorkLogs] = useState(false);
  

  useEffect(() => {
    setLoading(true); // Set loading to true when starting data fetching
    fetch('http://localhost:8080/api/allworklogs')
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

  const toggleProjectExpand = (index, projectKey) => {
    const updatedData = [...userShiftsData];
    updatedData[index].data[projectKey].expanded = !updatedData[index].data[projectKey].expanded;
    setUserShiftsData(updatedData);
  };

  const handleDelete = (index) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this data?');
    if (isConfirmed) {
      // After the data is successfully deleted, you can remove it from the state
      const updatedData = [...userShiftsData];
      updatedData.splice(index, 1);
      setUserShiftsData(updatedData);
    }
  };
  // Function to toggle the visibility of WorkLogsComp
  const toggleWorkLogs = () => {
    setShowWorkLogs(!showWorkLogs);
  };

    return (
    <div className="shift-container">
    <div className="centered-button">
    <button onClick={toggleWorkLogs}>
        {showWorkLogs ? 'Hide Shifts data' : 'click here for the current week worklogs'}
      </button>
    </div>

    {showWorkLogs && <WorkLogsComp />}
    <p >Worklogs by week Archive</p><br></br>

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
                  <button className="red-b" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </td>
              </tr>
              {item.expanded && (
                Object.keys(item.data).map((projectKey) => {
                  const project = item.data[projectKey];
                  return (
                    <React.Fragment key={projectKey}>
                      <tr>
                        <td colSpan="2">
                          <h4>Project Name: {project.projectName}</h4>
                        </td>
                        <td>
                          <button onClick={() => toggleProjectExpand(index, projectKey)}>
                            {project.expanded ? 'Collapse' : 'Expand'}
                          </button>
                        </td>
                      </tr>
                      {project.expanded && (
                        project.users.map((user) => (
                          <tr key={user.displayName}>
                            <td colSpan="2">
                              <h5 className='nice'>User: {user.displayName}</h5>
                              <p className='nicer'>Email: {user.email}</p>
                              {user.issues.map((issue) => (
                                <div className="issue-container" key={issue.issueId}>
                                  <h6>Issue ID: {issue.issueId}</h6>
                                  <p>Issue Key: {issue.issueKey}</p>
                                  <p>Summary: {issue.summary}</p>
                                  {issue.worklogs.map((worklog) => (
                                    <div className="worklog-container" key={worklog.created}>
                                      <p>Worklog Created: {worklog.created}</p>
                                      <p>Worklog Updated: {worklog.updated}</p>
                                      <p>Time Spent: {worklog.timeSpent}</p>
                                      <p>Started: {worklog.started}</p>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>)}
    </div>
  );
};

export default ShiftDataComponent;
