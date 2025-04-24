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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);  // Close menu on route change
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(prevState => !prevState);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);  // Close menu on logout
  };

  const navLinks = [
    { to: '/', text: 'Home' },
    { to: '/recipe', text: 'Recipes' },
    { to: '/my-recipes', text: 'My Recipes' },
    { to: '/about', text: 'About' },
    { to: '/contact', text: 'Contact' },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/about" className="logo">
          <img src="https://s.tmimgcdn.com/scr/1200x750/332800/cooking-tips-and-secret-recipes-food-related-book-cover-design_332805-original.jpg" className="logo-img" alt="Logo" />
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
            {navLinks.map(({ to, text }) => (
              <Link 
                key={to} 
                to={to} 
                className={location.pathname === to ? 'active' : ''}
              >
                {text}
              </Link>
            ))}
          </div>

          <div className="auth-buttons">
            {user ? (
              <div className="user-menu">
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/register" className="signup-btn">Register</Link>
              </>
            )}
          </div>
        </nav>

        {isMenuOpen && <div className="overlay active" onClick={toggleMenu}></div>}
      </div>
    </header>
  );
};

export default Header;
