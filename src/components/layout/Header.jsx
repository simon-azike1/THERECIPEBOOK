import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">TheRecipeBook</div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#recipes">Recipes</a>
          <a href="#meal-planner">Meal Planner</a>
          <a href="#about">About</a>
          <button className="login-btn">Login</button>
        </nav>
      </div>
    </header>
  );
};

export default Header; 