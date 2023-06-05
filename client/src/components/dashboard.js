import React, { useState } from 'react';
import '../styles/dashboard.css'; // Import the CSS file for styling
import Component1 from './Worklogs'; // Import the first component
import Component2 from './teamshifts'; // Import the second component
import WeeklyData from './worklogsdata'; // Import the WeeklyData component
import ShiftsData from './ShiftsData';

const Dashboard = ({ userName }) => {
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [showButtons, setShowButtons] = useState(false);
  const [showComponent1, setShowComponent1] = useState(false);
  const [showComponent2, setShowComponent2] = useState(false);
  const [showWeeklyData, setShowWeeklyData] = useState(false);
  const [showShiftsData , setShowShiftsData] = useState(false);

  const menuItems = [
    { title: 'Home', icon: '🏠' },
    { title: 'Profile', icon: '👤' },
    { title: 'Real-time Update', icon: '⚙️' },
    { title: 'Weekly Worklogs', icon: '⚙️' },
    { title: 'Weekly Shifts', icon: '⚙️' },
    { title: 'Workflow', icon: '⚙️' },
    // Add more menu items as needed
  ];

  const handleMenuItemClick = (title) => {
    setActiveMenuItem(title);
    setShowButtons(false);
    setShowComponent1(false);
    setShowComponent2(false);
    setShowWeeklyData(false);
    setShowShiftsData(false);


    if (title === 'Real-time Update') {
      setShowButtons(true);
    }
    if (title === 'Weekly Worklogs') {
      setShowWeeklyData(true);
    }
    if (title === 'Weekly Shifts') {
      setShowShiftsData(true);
    }
    // Perform any additional logic or navigation here
  };

  const handleButton1Click = () => {
    setShowComponent1(true);
    setShowComponent2(false);
  };

  const handleButton2Click = () => {
    setShowComponent1(false);
    setShowComponent2(true);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="user-profile">
          <span className="user-icon">👤</span>
          <span className="user-name">{userName}</span>
        </div>
        <br /><br /><br /><br />
        <ul className="menu">
          {menuItems.map((menuItem, index) => (
            <li
              key={index}
              className={menuItem.title === activeMenuItem ? 'active' : ''}
              onClick={() => handleMenuItemClick(menuItem.title)}
            >
              <span className="menu-icon">{menuItem.icon}</span>
              <span className="menu-title">{menuItem.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="content">
        <div className="welcome-message">
          <p></p>
        </div>
        <br />
        <div className="dashboard-content">
          <h2>{activeMenuItem}</h2>
          {activeMenuItem === 'Real-time Update' && showButtons && (
            <div className="buttons-container">
              <button className="cool-button" onClick={handleButton1Click}>
                Update Jira data into the database
              </button>
              <button className="cool-button" onClick={handleButton2Click}>
                Update shifts data into the database
              </button>
            </div>
          )}

          {activeMenuItem === 'Weekly Worklogs' && showWeeklyData && <WeeklyData />}
          {activeMenuItem === 'Weekly Shifts' && showShiftsData && <ShiftsData />}
          {showComponent1 && <Component1 />}
          {showComponent2 && <Component2 />}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Dashboard userName={'userName'} />
    </div>
  );
};

export default App;
