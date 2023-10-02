import React, { useState, useEffect } from 'react';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`welcome-page ${fadeIn ? 'fade-in' : ''}`}>
      <h1 className="welcome-heading">Welcome to your dashboard</h1>
      <p className="welcome-message">
        Enjoy your stay and explore all the amazing features we offer!
      </p>
    </div>
  );
};

export default WelcomePage;
