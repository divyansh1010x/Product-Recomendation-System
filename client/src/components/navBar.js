import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TypewriterEffect } from './typewriter';
import './navBar.css';

const Navbar = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userName = user.name;
  const navigate = useNavigate();

  const SignOut = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("favorite_category");
    sessionStorage.removeItem("cart");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
          <TypewriterEffect
            text={`Hi ${userName || "Guest"}`}
            className="typewriter"
            typingSpeed={150}
          />
        <div className="navbar-actions">
          <button className="button" onClick={() => navigate('/dummy')}>Home</button>
          <button className="button" onClick={() => navigate('/search')}>Search</button>
          <button className="button" onClick={() => navigate('/cart')}>Cart</button>
          <button onClick={SignOut} className="button logout">Log Out</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
