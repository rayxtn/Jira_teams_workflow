import React, { useEffect, useState } from 'react';

const ShiftsDataComponent = () => {
  const [userShiftsData, setUserShiftsData] = useState([]); // Set up the state for user shifts data

  useEffect(() => {
    // Fetch data from the server here and update the userShiftsData state
    fetch('http://localhost:8080/api/allworklogs')
      .then(response => response.json())
      .then(data => setUserShiftsData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {userShiftsData.map((item) => (
        <div key={item._id}>
          <h3>Start Date: {item.startDate}</h3>
          <h3>End Date: {item.endDate}</h3>
          {item.data.map((project) => (
            <div key={project.projectName}>
              <h4>Project Name: {project.projectName}</h4>
              {project.users.map((user) => (
                <div key={user.displayName}>
                  <h5>User: {user.displayName}</h5>
                  <p>Email: {user.email}</p>
                  {user.issues.map((issue) => (
                    <div key={issue.issueId}>
                      <h6>Issue ID: {issue.issueId}</h6>
                      <p>Issue Key: {issue.issueKey}</p>
                      <p>Summary: {issue.summary}</p>
                      {issue.worklogs.map((worklog) => (
                        <div key={worklog.created}>
                          <p>Worklog Created: {worklog.created}</p>
                          <p>Worklog Updated: {worklog.updated}</p>
                          <p>Time Spent: {worklog.timeSpent}</p>
                          <p>Started: {worklog.started}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShiftsDataComponent;
