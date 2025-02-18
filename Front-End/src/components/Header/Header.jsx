import React, { useState } from 'react';
import './header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
       
       <div className="logo">
          <span className="logo-text"><Link to="/Register"  className='logo-text logo-text-two'> TheRecipeBook</Link></span>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        {/* Navigation */}
        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#recipes" onClick={() => setIsMenuOpen(false)}>Recipes</a>
          <a href="#meal-planner" onClick={() => setIsMenuOpen(false)}>Meal Planner</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="signup-btn" style={{ textDecoration: 'none', color: 'white' }}>Register</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;