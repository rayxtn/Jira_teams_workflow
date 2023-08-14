import React, { useState, useEffect } from 'react';
import '../styles/IssuesList.css'; // Import your CSS file for styling

function IssuesList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIssueId, setExpandedIssueId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8080/api/weekissues');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setData(responseData);
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
        {data.issues.map((issue) => (
          <li key={issue._id} className="project-item">
            <h3>{issue.projectName}</h3>
            <p className="assignee">Assignee: {issue.displayName}</p>
            <p className="assignee">Email: {issue.email}</p>
            <ul className="sub-issues-list">
              {issue.issues.map((subIssue) => (
                <li
                  key={subIssue.issueId}
                  className="sub-issue-item"
                  onClick={() => handleIssueClick(subIssue.issueId)}
                >
                  <p className="sub-issue-summary">Issue: {subIssue.summary}</p>
                  {expandedIssueId === subIssue.issueId && (
                    <ul className="worklogs-list">
                      {subIssue.worklogs.map((worklog) => (
                        <li key={worklog._id} className="worklog-item">
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IssuesList;
