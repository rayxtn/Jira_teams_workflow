import React, { useState } from 'react';
import '../styles/dashboard.css'; // Import the CSS file for styling
import Component1 from './Worklogs'; // Import the first component
import Component2 from './teamshifts'; // Import the second component
import worklogsdata from './worklogsdata';

const Dashboard = ({ userName }) => {
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [showButtons, setShowButtons] = useState(false);
  const [showComponent1, setShowComponent1] = useState(false);
  const [showComponent2, setShowComponent2] = useState(false);

  const menuItems = [
    { title: 'Home', icon: '🏠' },
    { title: 'Profile', icon: '👤' },
    { title: 'Real-time Update', icon: '⚙️' },
    { title: 'Weekly DATA', icon: '⚙️' },
    { title: 'Worklogs', icon: '⚙️' },
    { title: 'Shifts', icon: '⚙️' },
    // Add more menu items as needed
  ];

  const handleMenuItemClick = (title) => {
    setActiveMenuItem(title);
    setShowButtons(false); // Reset the showButtons state when a different menu item is clicked
    setShowComponent1(false); // Reset the showComponent1 state when a different menu item is clicked
    setShowComponent2(false); // Reset the showComponent2 state when a different menu item is clicked
    if (title === 'Real-time Update') {
      setShowButtons(true);
    }
    // Perform any additional logic or navigation here
  };

  const handleButton1Click = () => {
    // Handle the action for Button 1
    setShowComponent1(true);
    setShowComponent2(false);
  };

  const handleButton2Click = () => {
    // Handle the action for Button 2
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
          {/* Add your specific dashboard components and content here */}
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
          
          {showComponent1 && <Component1 />}
          {showComponent2 && <Component2 />}
          {/* Additional dashboard components */}
          {activeMenuItem === "Weekly DATA"}
          {worklogsdata && <worklogsdata />}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Assuming you have the user's name available in your component's state or context
  // const [userName, setUserName] = useState('John Doe');

  return (
    <div>
      {/* Other components and content */}
      <Dashboard userName={'userName'} />
    </div>
  );
};

export default App;
