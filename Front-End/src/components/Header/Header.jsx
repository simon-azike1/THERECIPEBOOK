import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, ChefHat, BookOpen, Home, Utensils, Info, Mail, LogOut } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { dispatch(logout()); setMenuOpen(false); };

  const publicLinks = [
    { to: '/',        text: 'Home',    icon: Home     },
    { to: '/recipes', text: 'Recipes', icon: Utensils },
    { to: '/about',   text: 'About',   icon: Info     },
    { to: '/contact', text: 'Contact', icon: Mail     },
  ];

  const privateLinks = user ? [
    { to: '/meal-planning', text: 'Meal Plan', icon: ChefHat  },
    { to: '/my-recipes',    text: 'Kitchen',   icon: BookOpen },
  ] : [];

  const allLinks = [...publicLinks, ...privateLinks];
  const isActive = (to) => location.pathname === to;

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100'
          : 'bg-white/80 backdrop-blur-lg border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80"
                  alt="TheRecipeBook"
                  className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl object-cover shadow-md ring-2 ring-white group-hover:ring-[#3a5d8f]/30 transition-all duration-300"
                />
              </div>
              <span className="text-lg lg:text-xl font-black bg-gradient-to-r from-gray-900 via-[#3a5d8f] to-emerald-600 bg-clip-text text-transparent tracking-tight">
                TheRecipeBook
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {allLinks.map(({ to, text }) => (
                <Link key={to} to={to}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                    isActive(to)
                      ? 'text-[#3a5d8f] bg-[#3a5d8f]/8'
                      : 'text-gray-600 hover:text-[#3a5d8f] hover:bg-[#3a5d8f]/5'
                  }`}>
                  {text}
                  <span className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-[#3a5d8f] to-emerald-500 transition-all duration-300 ${
                    isActive(to) ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* ── Desktop auth ── */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-white text-[10px] font-black">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 rounded-xl shadow-md shadow-[#3a5d8f]/20 transition-all">
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login"
                    className="px-4 py-2 text-sm font-semibold text-[#3a5d8f] border-2 border-[#3a5d8f]/25 hover:border-[#3a5d8f] hover:bg-[#3a5d8f]/5 rounded-xl transition-all duration-200">
                    Login
                  </Link>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/register"
                      className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 rounded-xl shadow-md shadow-[#3a5d8f]/20 transition-all">
                      Register
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* ── Mobile menu button ── */}
            <button onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:text-[#3a5d8f] hover:bg-[#3a5d8f]/8 transition-all">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile slide-out drawer ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-40 lg:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
                <span className="font-black text-gray-900">Menu</span>
                <button onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User info */}
              {user && (
                <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-[#3a5d8f]/8 to-emerald-500/8 rounded-2xl border border-[#3a5d8f]/10 flex items-center gap-3 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-white text-sm font-black">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {/* ── Nav links ── */}
              <div className="flex-1 px-4 py-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
                  Navigation
                </p>

                <Link to="/" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#3a5d8f] transition-all">
                  <Home className="w-4 h-4 text-gray-400" /> Home
                </Link>
                <Link to="/recipes" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#3a5d8f] transition-all">
                  <Utensils className="w-4 h-4 text-gray-400" /> Recipes
                </Link>
                <Link to="/about" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#3a5d8f] transition-all">
                  <Info className="w-4 h-4 text-gray-400" /> About
                </Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#3a5d8f] transition-all">
                  <Mail className="w-4 h-4 text-gray-400" /> Contact
                </Link>

                {user && (
                  <>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 mt-5 px-2">
                      My Account
                    </p>
                    <Link to="/meal-planning" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-all">
                      <ChefHat className="w-4 h-4 text-gray-400" /> Meal Plan
                    </Link>
                    <Link to="/my-recipes" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-all">
                      <BookOpen className="w-4 h-4 text-gray-400" /> Kitchen
                    </Link>
                  </>
                )}
              </div>

              {/* ── Drawer footer ── */}
              <div className="p-4 border-t border-gray-100 flex-shrink-0">
                {user ? (
                  <button onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white font-bold rounded-2xl shadow-md text-sm transition-all">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login"
                      className="block w-full text-center py-3 text-sm font-semibold text-[#3a5d8f] border-2 border-[#3a5d8f]/25 hover:border-[#3a5d8f] rounded-2xl transition-all">
                      Login
                    </Link>
                    <Link to="/register"
                      className="block w-full text-center py-3 text-sm font-bold text-white bg-gradient-to-r from-[#3a5d8f] to-emerald-500 rounded-2xl shadow-md transition-all">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;