import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

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
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: '/', text: 'Home' },
    { to: '/recipes', text: 'Recipes' },
    { to: '/my-recipes', text: 'My Recipes' },
    { to: '/about', text: 'About' },
    { to: '/contact', text: 'Contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/98 backdrop-blur-md shadow-md' 
          : 'bg-white shadow-sm'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src="https://s.tmimgcdn.com/scr/1200x750/332800/cooking-tips-and-secret-recipes-food-related-book-cover-design_332805-original.jpg"
              className="h-12 w-12 rounded-lg border-2 border-yellow-400 transition hover:opacity-80"
              alt="Logo"
            />
          </Link>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open menu</span>
            <svg
              className={`h-6 w-6 transition-transform duration-200 ${isMenuOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex lg:items-center lg:space-x-8`}>
            {navLinks.map(({ to, text }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${location.pathname === to 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'}
                  before:absolute before:left-0 before:bottom-0 before:h-0.5 
                  before:w-0 before:bg-yellow-400 before:transition-all before:duration-200
                  hover:before:w-full`}
              >
                {text}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full
                    hover:bg-green-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full
                    hover:bg-blue-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full
                    hover:bg-green-700 transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div
            className={`${
              isMenuOpen ? 'fixed inset-0 bg-gray-800 bg-opacity-50 z-40' : 'hidden'
            } lg:hidden transition-opacity duration-200`}
            onClick={toggleMenu}
          >
            <div
              className={`fixed top-0 right-0 bottom-0 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col h-full pt-20 pb-6 px-4">
                <nav className="flex-1 space-y-2">
                  {navLinks.map(({ to, text }) => (
                    <Link
                      key={to}
                      to={to}
                      className={`block px-4 py-2 text-base font-medium rounded-lg transition-colors duration-200
                        ${location.pathname === to
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {text}
                    </Link>
                  ))}
                </nav>

                <div className="pt-6 space-y-3">
                  {user ? (
                    <>
                      <p className="px-4 text-sm font-medium text-gray-700">
                        {user.name}
                      </p>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg
                          hover:bg-green-700 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 
                          rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-green-600 
                          rounded-lg hover:bg-green-700 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
