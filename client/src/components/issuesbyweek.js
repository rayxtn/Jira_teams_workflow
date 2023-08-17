// ... (imports and component definition)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/IssuesList.css'; // Import your CSS file for styling
function IssuesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIssueId, setExpandedIssueId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8080/api/weekissues');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setData(responseData.data || []); // Ensure a default empty array if data is missing
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleIssueClick = (issueId) => {
    if (expandedIssueId === issueId) {
      setExpandedIssueId(null);
    } else {
      setExpandedIssueId(issueId);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="issues-list-container">
      <h2>Issues</h2>
      <ul className="projects-list">
        {data.map((project) => (
          <li key={project._id} className="project-item">
            <h3>{project.projectName}</h3>
            {Array.isArray(project.users) && project.users.length > 0 && (
              <ul className="users-list">
                {project.users.map((user, userIndex) => (
                  <li key={userIndex} className="user-item">
                    <p className="assignee">Assignee: {user.displayName}</p>
                    <p className="assignee">Email: {user.email}</p>
                  </li>
                ))}
              </ul>
            )}
            {Array.isArray(project.issues) && project.issues.length > 0 && (
              <ul className="sub-issues-list">
                {project.issues.map((subIssue) => (
                  <li
                    key={subIssue.issueId}
                    className="sub-issue-item"
                    onClick={() => handleIssueClick(subIssue.issueId)}
                  >
                    <p className="sub-issue-summary">Issue: {subIssue.summary}</p>
                    {expandedIssueId === subIssue.issueId && Array.isArray(subIssue.worklogs) && subIssue.worklogs.length > 0 && (
                      <ul className="worklogs-list">
                        {subIssue.worklogs.map((worklog, worklogIndex) => (
                          <li key={worklogIndex} className="worklog-item">
                            <p>Created: {worklog.created}</p>
                            <p>Updated: {worklog.updated}</p>
                            <p>Started: {worklog.started}</p>
                            <p>Time Spent: {worklog.timeSpent}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IssuesList;