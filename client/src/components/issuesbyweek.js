import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/IssuesList.css';

function IssuesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8080/api/weekissues');
        setData(response.data || []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleProjectClick = (projectIndex) => {
    setSelectedProject(selectedProject === projectIndex ? null : projectIndex);
  };

  const renderWorklogs = (worklogs) => (
    <ul className="worklogs-list">
      {worklogs.map((worklog, worklogIndex) => (
        <li key={worklogIndex} className="worklog-item">
          <div className="worklog-date">
            Date: {new Date(worklog.started).toLocaleDateString()}
          </div>
          <div className="worklog-time">
            Time Spent: {worklog.timeSpent}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="worklog-container">
      {data.map((item, index) => (
        <div key={index} className="item-container">
          <div className="item-dates">
            <div className="start-date">
              Start Date: {new Date(item.startDate).toLocaleDateString()}
            </div>
            <div className="end-date">
              End Date: {new Date(item.endDate).toLocaleDateString()}
            </div>
          </div>
          {item.data.map((project, projectIndex) => (
            <div
              key={projectIndex}
              className={`project-container ${selectedProject === projectIndex ? 'selected' : ''}`}
              onClick={() => handleProjectClick(projectIndex)}
            >
              <h3>Project: {project.projectName}</h3>
              {selectedProject === projectIndex && (
                <div className="users-container">
                  {project.users.map((user, userIndex) => (
                    <div key={userIndex} className="user-container">
                      <strong>User: {user.displayName}</strong>
                      <br></br>
                      <strong>Email: {user.email}</strong>
                      <div className="issues-container">
                        {user.issues.map((issue, issueIndex) => (
                          <div key={issueIndex} className="issue-container">
                            <strong>Issue: {issue.summary}</strong>
                            <div className="worklogs-container">
                              {renderWorklogs(issue.worklogs)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default IssuesList;
