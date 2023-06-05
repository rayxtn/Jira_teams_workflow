import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShiftsData = () => {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    // Fetch shifts data from the server
    axios.get('http://localhost:8080/api/fetchs')
      .then(response => {
        if (response.data && response.data.shifts) {
          setShifts(response.data.shifts);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const renderTableCell = (shift, property) => {
    if (shift && shift.hasOwnProperty(property)) {
      return shift[property];
    } else {
      return 'N/A'; // Placeholder value for missing data
    }
  };

  return (
    <div>
      <h1>Shifts List</h1>
      {shifts.length === 0 ? (
        <p>No shifts available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Display Name</th>
              <th>Start DateTime</th>
              <th>End DateTime</th>
              {/* Add more table headers for other shift properties */}
            </tr>
          </thead>
          <tbody>
            {shifts.map(shift => (
              <tr key={shift.id}>
                <td>{renderTableCell(shift, 'id')}</td>
                <td>{renderTableCell(shift, 'displayName')}</td>
                <td>{renderTableCell(shift, 'startDateTime')}</td>
                <td>{renderTableCell(shift, 'endDateTime')}</td>
                {/* Add more table cells for other shift properties */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShiftsData;
