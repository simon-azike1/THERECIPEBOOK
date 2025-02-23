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
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/recipe" onClick={() => setIsMenuOpen(false)}>Recipes</Link>
          <Link to="/meal-planner" onClick={() => setIsMenuOpen(false)}>Meal Planner</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
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