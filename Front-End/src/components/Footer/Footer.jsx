import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  const quickLinks = [
    { to: '/', text: 'Home' },
    { to: '/recipes', text: 'Recipes' },
    { to: '/about', text: 'About' },
    { to: '/contact', text: 'Contact' }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-[#3a5d8f] bg-clip-text text-transparent">
              TheRecipeBook
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Discover, create, and share delicious recipes with our growing community of food enthusiasts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.to} className="text-gray-300 hover:text-[#3a5d8f] hover:underline transition-colors flex items-center gap-2 group">
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>&copy; {year} TheRecipeBook. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[#3a5d8f] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#3a5d8f] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
