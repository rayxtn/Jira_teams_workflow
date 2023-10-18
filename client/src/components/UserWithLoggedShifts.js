import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners';
import '../styles/UserShiftsDisplay.css';

function formatDateWithDay(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function UserShiftsDisplay() {
  const [loading, setLoading] = useState(true);
  const [userShiftsData, setUserShiftsData] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    setLoading(true);

    fetch('http://localhost:8080/api/validation')
      .then((response) => response.json())
      .then((data) => {
        setUserShiftsData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  function toggleGroup(groupName) {
    setExpandedGroups((prevExpandedGroups) => ({
      ...prevExpandedGroups,
      [groupName]: !prevExpandedGroups[groupName],
    }));
  }

  function exportToPDF() {
    const doc = new jsPDF();

    let startY = 10;

    Object.keys(userShiftsData).forEach((groupName) => {
      const group = userShiftsData[groupName];
      doc.setFontSize(16);
      doc.text(`Group Name: ${groupName}`, 10, startY);

      startY += 15;

      Object.keys(group).forEach((userEmail) => {
        const user = group[userEmail];
        doc.setFontSize(14);
        doc.text(`User Email: ${userEmail}`, 10, startY);

        startY += 15;

        user.shifts.forEach((shift) => {
          const shiftInfo = `${shift.displayName} - ${formatDateWithDay(shift.startDateTime)} (${
            shift.validated ? 'Validated' : 'Not Validated'
          })`;
          const textColor = shift.validated ? 'green' : 'red';
          doc.setTextColor(textColor);

          doc.text(shiftInfo, 10, startY);
          doc.setTextColor('black'); // Reset text color

          startY += 10;
        });

        const isUserValidatedAllShifts = user.shifts.every((shift) => shift.validated);
        const validationStatus = isUserValidatedAllShifts
          ? 'User validated all shifts'
          : 'User did not validate all shifts';

        doc.setFontSize(12);
        doc.text(`Validation Status: ${validationStatus}`, 10, startY);
        startY += 15;
      });

      startY = 10;
      doc.addPage();
    });

    doc.save('user_shifts.pdf');
  }

  return (
    <div id="pdf-container" className="user-shifts-container">
            <div className="button-group">
        <button className="custom-button" onClick={exportToPDF}>Export Report</button>
      </div>
      {loading ? (
        <div className="loading-spinner">
          <RingLoader color="#36D7B7" loading={loading} css={css`margin: 150px auto;`} size={150} />
        </div>
      ) : (
        Object.keys(userShiftsData).map((groupName) => {
          const group = userShiftsData[groupName];
          const isGroupExpanded = expandedGroups[groupName] || false;

          return (
            <div key={groupName} className="group-container">
              <h2
                className={`group-name ${isGroupExpanded ? 'expanded' : ''}`}
                onClick={() => toggleGroup(groupName)}
              >
                Group Name: {groupName}
              </h2>
              {isGroupExpanded && (
                <table className="user-container">
                  <tbody>
                    {Object.keys(group).map((userEmail) => {
                      const user = group[userEmail];
                      const isUserValidatedAllShifts = user.shifts.every((shift) => shift.validated);

                      return (
                        <tr
                          key={userEmail}
                          className={`user-row ${
                            isUserValidatedAllShifts
                              ? 'user-validated'
                              : 'user-not-validated'
                          }`}
                        >
                          <td>
                            <strong>User Email:</strong> {userEmail}
                            <br />
                            <strong>User Name:</strong> {user.userDisplayName}
                          </td>
                          <td>
                            <table className="shifts-table">
                              <tbody>
                                {user.shifts.map((shift, shiftIndex) => (
                                  <tr key={shiftIndex}>
                                    <td>
                                      {shift.displayName} - {formatDateWithDay(shift.startDateTime)} (
                                      <span style={{ color: shift.validated ? 'green' : 'red' }}>
                                        {shift.validated ? 'Validated' : 'Not Validated'}
                                      </span>
                                      )
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                          <td className="status-cell">
                            <span className={isUserValidatedAllShifts ? 'validated-status green' : 'validated-status red'}>
                              {isUserValidatedAllShifts ? 'User validated all shifts' : 'User did not validate all shifts'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default UserShiftsDisplay;
