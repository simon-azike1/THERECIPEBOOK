import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  const socialLinks = [
    { href: 'https://facebook.com', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', label: 'Facebook', color: 'from-blue-600 to-blue-800' },
    { href: 'https://twitter.com', icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z', label: 'Twitter', color: 'from-sky-400 to-blue-500' },
    { href: 'https://instagram.com', icon: 'M2 2v20h20V2M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01', label: 'Instagram', color: 'from-pink-500 to-purple-600' },
    { href: 'https://pinterest.com', icon: 'M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10M8.5 14.5s1.5 2 4.5 2c5 0 6-4 6-7 0-3-2-5-5-5-4 0-6 3-6 6 0 2 1 3 2 3 1.5 0 1-2 1-2s-1-1-1-2.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5-1 5.5-3.5 5.5c-1.5 0-2.5-1-2.5-1', label: 'Pinterest', color: 'from-red-500 to-orange-500' }
  ];

  const quickLinks = [
    { to: '/', text: 'Home' },
    { to: '/recipes', text: 'Recipes' },
{ to: '/my-recipes', text: 'My Recipes' },
    { to: '/create-recipe', text: 'Create Recipe' },
    { to: '/about', text: 'About' },
    { to: '/contact', text: 'Contact' }
  ];

  const categories = [
    'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Healthy'
  ];

  const support = [
    'FAQ', 'Privacy Policy', 'Terms of Service', 'Help Center', 'Feedback'
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
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="group w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-xl border border-white/20 hover:border-white/40"
                >
                  <svg className={`w-7 h-7 text-gray-300 group-hover:text-${social.color.split('-')[0]}-400 transition-colors`} fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
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

          {/* Categories */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link to={`/${category.toLowerCase()}`} className="text-gray-300 hover:text-yellow-400 hover:underline transition-colors">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              {support.map((item, index) => (
                <li key={index}>
                  <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-[#3a5d8f] hover:underline transition-colors">
                    {item}
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
            <Link to="/sitemap" className="hover:text-[#3a5d8f] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
