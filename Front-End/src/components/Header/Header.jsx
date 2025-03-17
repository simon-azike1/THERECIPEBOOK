import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import './header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">TheRecipeBook</span>
        </Link>

        <button 
          className="mobile-menu-btn" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-items">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
            <Link to="/recipe" className={location.pathname === '/recipe' ? 'active' : ''}>
              Recipes
            </Link>
            <Link to="/meal-planning" className={location.pathname === '/meal-planning' ? 'active' : ''}>
              Meal Planner
            </Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </div>

          <div className="auth-buttons">
            {user ? (
              <>
                <div className="user-menu">
                  <span className="user-name">{user.name}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/register" className="signup-btn">Register</Link>
              </>
            )}
          </div>
        </nav>

        {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
      </div>
    </header>
  );
};

export default Header;