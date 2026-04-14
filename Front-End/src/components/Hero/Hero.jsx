import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Star, Users, BookOpen } from 'lucide-react';
import { getAllRecipes, selectRecipeCount } from '../../features/recipes/recipesSlice';

// Food thumbnails that float on the right
const THUMBNAILS = [
  { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', cls: 'top-6 right-6 w-24 h-24 rotate-3'     },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80', cls: 'top-36 right-4 w-20 h-20 -rotate-2'  },
  { src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=200&q=80', cls: 'bottom-24 right-8 w-22 h-22 rotate-1' },
];

const Hero = () => {
  const dispatch = useDispatch();
  const recipeCount = useSelector(selectRecipeCount);
  const [counters, setCounters] = useState([0, 0, 0]);
  const [started,  setStarted]  = useState(false);

  const STATS = [
    { number: 100, suffix: '+', label: 'Active Cooks',   icon: Users    },
    { number: recipeCount || 0, suffix: '', label: 'Recipes',        icon: BookOpen },
    { number: 4.5,  suffix: '',  label: 'User Rating',    icon: Star     },
  ];

  // Fetch recipes on mount
  useEffect(() => {
    dispatch(getAllRecipes());
  }, [dispatch]);

  // Start counters after mount
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || recipeCount === 0) return;
    const ids = STATS.map((stat, i) => {
      const duration = stat.label === 'User Rating' ? 1200 : 1800;
      const steps    = duration / 30;
      const increment = stat.number / steps;
      return setInterval(() => {
        setCounters(prev => {
          const next = [...prev];
          next[i] = Math.min(+(next[i] + increment).toFixed(1), stat.number);
          return next;
        });
      }, 30);
    });
    return () => ids.forEach(clearInterval);
  }, [started, recipeCount]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 overflow-hidden flex items-center pt-20">
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Gradient blobs */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#3a5d8f]/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/6 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Text ── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-[#3a5d8f]/15 rounded-full shadow-sm mb-6">
              {/* <Sparkles className="w-3.5 h-3.5 text-amber-400" /> */}
              <span className="text-xs font-bold text-[#3a5d8f] uppercase tracking-widest">
                Your Culinary Community
                </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              <span className="text-gray-900">Create &amp; Share</span>
              <br />
              <span className="bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">
                Your Recipes
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
              Join our culinary community where passion meets plate. Discover, create,
              and share your favourite recipes with food enthusiasts worldwide.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 mb-14">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-[#3a5d8f]/25 text-base transition-all">
                  Start Cooking
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/recipes"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white/70 backdrop-blur-sm border-2 border-[#3a5d8f]/20 hover:border-[#3a5d8f]/60 text-[#3a5d8f] font-bold rounded-2xl shadow-md text-base transition-all">
                  <BookOpen className="w-5 h-5" />
                  Browse Recipes
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200/60">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Icon className="w-4 h-4 text-[#3a5d8f]/50" />
                    </div>
                    <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent leading-none">
                      {stat.label === 'User Rating'
                        ? counters[i].toFixed(1)
                        : `${Math.floor(counters[i]).toLocaleString()}${stat.suffix}`
                      }
                    </p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* ── Right: Image ── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block">

            {/* Main image */}
            <div className="relative w-full h-[540px] rounded-3xl overflow-hidden shadow-2xl shadow-[#3a5d8f]/15 border-4 border-white/60">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
                alt="Delicious food"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Floating recipe card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center shadow-md flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 text-sm">Healthy Recipes</p>
                    <p className="text-xs text-gray-400">Discover top-rated dishes</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-black text-gray-900">4.5</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating thumbnails */}
            {THUMBNAILS.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className={`absolute ${t.cls} rounded-2xl overflow-hidden border-3 border-white shadow-2xl hidden xl:block`}
                style={{ width: 88, height: 88 }}>
                <img src={t.src} alt="" className="w-full h-full object-cover" />
              </motion.div>
            ))}

            {/* Shopping list pill */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}
              className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl border border-white/60 hidden xl:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Easy Sharing</p>
              <p className="text-xs font-bold text-gray-800">Share & Plan Meals</p>
              <div className="flex gap-1 mt-2">
                {['#3a5d8f', '#10b981', '#f59e0b'].map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;