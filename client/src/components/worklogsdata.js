import React, { useState, useEffect } from 'react';

const Worklogsdata = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/assigneedata'); // Replace '/api/assignee' with the actual API endpoint to fetch data
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Data from MongoDB Collection:</h1>
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            <p>Assignee Name: {item.assigneeName}</p>
            <p>Assignee Email: {item.assigneeEmail}</p>
            <p>Issues:</p>
            <ul>
              {item.issues.map((issue) => (
                <li key={issue.issueId}>
                  <p>Issue ID: {issue.issueId}</p>
                  <p>Issue Key: {issue.issueKey}</p>
                  <p>Summary: {issue.summary}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Worklogsdata;
