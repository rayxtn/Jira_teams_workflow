import React, { useState } from 'react';
import '../styles/dashboard.css'; // Import the CSS file for styling
import Component1 from './Worklogs'; // Import the first component
import Component2 from './teamshifts'; // Import the second component
import WeeklyData from './issuesbyweek'; // Import the WeeklyData component
import ShiftsData from './weekshifts';
import UserData from './UserWithLoggedShifts';
import BonusData from './bonusdata';
import updateProfile from './Profile';
import Home from './home';
import Users from './usersdata';


const Dashboard = ({ userName }) => {
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [showButtons, setShowButtons] = useState(false);
  const [showComponent1, setShowComponent1] = useState(false);
  const [showComponent2, setShowComponent2] = useState(false);
  const [showWeeklyData, setShowWeeklyData] = useState(false);
  const [showShiftsData , setShowShiftsData] = useState(false);
  const [showUsersData,setShowUsersData] = useState(false);
  const [showBonusData, setShowBonusData] =useState(false);
  const [showupdateProfile, setShowupdateProfile] =useState(false);
  const [showHome,setShowHome] =useState(false);
  const [showUsers,setShowUsers] = useState(false);

  const menuItems = [
    { title: 'Home', icon: '🏠' },
    { title: 'Profile', icon: '🛠' },
    { title: 'Users', icon: '👤' },
    { title: 'Update', icon:'📡' },
    { title: 'Worklogs', icon: '📥' },
    { title: 'Shifts', icon: '📥' },
    {title: 'Logged Users', icon: '📝'},
    { title: 'Workflow Bonus', icon: '📟' },

   
    // Add more menu items as needed
  ];

  const handleMenuItemClick = (title) => {
    setActiveMenuItem(title);
    setShowButtons(false);
    setShowHome(false);
    setShowComponent1(false);
    setShowComponent2(false);
    setShowWeeklyData(false);
    setShowShiftsData(false);
    setShowUsersData(false);
    setShowBonusData(false);
    setShowupdateProfile(false);
    setShowUsers(false);

    if (title === 'Users') {
      setShowUsers(true);
    }
    if (title === 'Update') {
      setShowButtons(true);
    }
    if(title === "Home")
    {
      setShowHome(true);
    }
    if (title === 'Worklogs') {
      setShowWeeklyData(true);
    }
    if (title === 'Shifts') {
      setShowShiftsData(true);
    }
    if(title === 'Logged Users') {
      setShowUsersData(true);
    }
    if(title === 'Workflow Bonus') {
      setShowBonusData(true);
    } 
    if (title === 'Profile') {
      setShowupdateProfile(true);
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
          <span className="user-name"><p>ADMIN</p></span>
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
          {activeMenuItem === 'Update' && showButtons && (
            <div className="buttons-container">
              <button className="cool-button" onClick={handleButton1Click}>
                Update Worklogs data
              </button>
              <button className="cool-button" onClick={handleButton2Click}>
                Update shifts data 
              </button>
            </div>
          )}
          {activeMenuItem === 'Users' && showUsers && <Users />}
          {activeMenuItem === 'Worklogs' && showWeeklyData && <WeeklyData />}
          {activeMenuItem === 'Shifts' && showShiftsData && <ShiftsData />}
          {activeMenuItem === 'Logged Users' && showUsersData && <UserData/>}
          {activeMenuItem === 'Workflow Bonus' && showBonusData && <BonusData/>}
          {activeMenuItem === 'Home' && showHome && <Home />}
          {activeMenuItem === 'Profile' && showupdateProfile && <updateProfile />}
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
