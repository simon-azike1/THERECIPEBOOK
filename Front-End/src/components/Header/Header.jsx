import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import "./header.css";


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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);  
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
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://s.tmimgcdn.com/scr/1200x750/332800/cooking-tips-and-secret-recipes-food-related-book-cover-design_332805-original.jpg"
              className="h-12 w-12 rounded-lg border-2 border-yellow-400 transition hover:opacity-80"
              alt="Logo"
            />
            <span className={`logo-name ${isScrolled ? 'text-scrolled' : ''}`}>
              TheRecipeBook
            </span>
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
          <nav className="hidden lg:flex lg:items-center lg:space-x-8">
            {navLinks.map(({ to, text }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${location.pathname === to 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'}`}
              >
                {text}
              </Link>
            ))}
          </nav>

       {/* Mobile Navigation (Slide-in from Right) */}
<div
  className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
    ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}
>
  <div className="flex flex-col items-center space-y-6 py-10">
    {navLinks.map(({ to, text }) => (
      <Link
        key={to}
        to={to}
        className={`text-gray-700 text-lg font-medium transition-colors duration-200
          ${location.pathname === to ? 'text-blue-600' : 'hover:text-blue-600'}`}
        onClick={() => setIsMenuOpen(false)} // close menu on click
      >
        {text}
      </Link>
    ))}

    {/* Auth buttons */}
    {user ? (
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full
          hover:bg-green-700 transition-colors duration-200"
      >
        Logout
      </button>
    ) : (
      <>
        <Link
          to="/login"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full
            hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setIsMenuOpen(false)}
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full
            hover:bg-green-700 transition-colors duration-200"
          onClick={() => setIsMenuOpen(false)}
        >
          Register
        </Link>
      </>
    )}
  </div>
</div>


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
        </div>
      </div>
    </header>
  );
};

export default Header;
