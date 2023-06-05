import React, { useState, useEffect } from 'react';

const Worklogsdata = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/fetchw'); // Replace '/api/assignee' with the actual API endpoint to fetch data
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {currentItems.map((assignees, index) => (
        <div key={index}>
          <h3>Assignee Name: {assignees.assigneeName}</h3>
          {assignees.issues.map((issue, index) => (
            <div key={index}>
              <h1>Worklogs done for this week:</h1>
              {issue.worklogs.map((worklog, index) => (
                <div key={index}>
                  <p>Worklog ID: {worklog.id}</p>
                  <p>Created: {worklog.created}</p>
                  <p>Updated: {worklog.updated}</p>
                  <p>Started: {worklog.started}</p>
                  <p>Time Spent: {worklog.timeSpent}</p>
                  <p>Time Spent Seconds: {worklog.timeSpentSeconds}</p>
                  <p>Issue ID: {worklog.issueId}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <div className="pagination">
        {pageNumbers.map((pageNumber) => (
          <button key={pageNumber} onClick={() => handleClick(pageNumber)}>
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Worklogsdata;
