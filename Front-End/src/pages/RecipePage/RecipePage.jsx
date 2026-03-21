import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllRecipes } from '../../features/recipes/recipesSlice';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-hot-toast';
import {
  Search, Clock, ChevronDown, Flame, Star, Users, ChefHat,
  Utensils, X, SlidersHorizontal, Sparkles, ArrowRight,
} from 'lucide-react';

// ─── Filter config ─────────────────────────────────────────────────────────────
const CUISINES = [
  'All', 'Italian', 'Indian', 'Mexican', 'Chinese',
  'Japanese', 'Thai', 'American', 'French', 'Mediterranean', 'Other',
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const PREP_TIMES = [
  { label: 'Any time', value: 'all'  },
  { label: '≤ 15 min', value: '15'   },
  { label: '≤ 30 min', value: '30'   },
  { label: '≤ 1 hour', value: '60'   },
  { label: '1 hr+',    value: '61'   },
];

const DIETARY = [
  'All', 'Vegan', 'Vegetarian', 'Gluten-Free',
  'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher',
];

const SORT_OPTIONS = [
  { key: 'rating',     label: 'Top Rated',  icon: '⭐' },
  { key: 'time',       label: 'Quickest',   icon: '⏱️' },
  { key: 'difficulty', label: 'Difficulty', icon: '⚡' },
  { key: 'newest',     label: 'Newest',     icon: '🆕' },
];

const DIFF_STYLE = {
  Easy:   'bg-emerald-100/90 text-emerald-700',
  Medium: 'bg-amber-100/90 text-amber-700',
  Hard:   'bg-red-100/90 text-red-700',
};

const FOOD_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2070&q=80';

// ─── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white/60 rounded-3xl overflow-hidden border border-white/50 animate-pulse">
    <div className="h-52 bg-gray-200/80" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200/80 rounded-full w-3/4" />
      <div className="h-4 bg-gray-200/80 rounded-full w-1/2" />
      <div className="flex gap-2">
        <div className="h-3 bg-gray-200/80 rounded-full w-16" />
        <div className="h-3 bg-gray-200/80 rounded-full w-12" />
      </div>
    </div>
  </div>
);

// ─── Recipe card ───────────────────────────────────────────────────────────────
const RecipeCard = ({ recipe, index }) => {
  const navigate = useNavigate();
  const total = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.35 }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/recipe/${recipe._id}`)}
      className="group bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 shadow-md hover:shadow-2xl hover:shadow-[#3a5d8f]/10 cursor-pointer transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {recipe.recipeImage ? (
          <img src={recipe.recipeImage} alt={recipe.recipeName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Utensils className="w-10 h-10 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-[#3a5d8f] shadow-sm">
            <ChefHat className="w-3 h-3" />{recipe.cuisineType}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-sm ${DIFF_STYLE[recipe.difficultyLevel] || 'bg-gray-100 text-gray-600'}`}>
            <Flame className="w-3 h-3" />{recipe.difficultyLevel}
          </span>
        </div>

        {/* Rating */}
        {recipe.rating > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-white text-[11px] font-bold">{recipe.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-[#3a5d8f] transition-colors mb-1">
          {recipe.recipeName}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{recipe.description}</p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />{total} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-500" />{recipe.servingSize} servings
          </span>
        </div>

        {/* Dietary tags */}
        {recipe.dietaryRestrictions?.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-3">
            {recipe.dietaryRestrictions.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-[#3a5d8f]/8 text-[#3a5d8f] rounded-full border border-[#3a5d8f]/15">
                {tag}
              </span>
            ))}
            {recipe.dietaryRestrictions.length > 2 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                +{recipe.dietaryRestrictions.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Featured hero recipe ──────────────────────────────────────────────────────
const FeaturedRecipe = ({ recipe }) => {
  const navigate = useNavigate();
  if (!recipe) return null;
  const total = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => navigate(`/recipe/${recipe._id}`)}
      className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-2xl shadow-[#3a5d8f]/15 mb-10 h-72 md:h-80"
    >
      {recipe.recipeImage ? (
        <img src={recipe.recipeImage} alt={recipe.recipeName}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#3a5d8f] to-emerald-500" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

      {/* Featured label */}
      <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 bg-amber-400 rounded-full shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-amber-900" />
        <span className="text-[11px] font-black text-amber-900 uppercase tracking-widest">Featured Recipe</span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">{recipe.cuisineType}</span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${DIFF_STYLE[recipe.difficultyLevel]}`}>{recipe.difficultyLevel}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">{recipe.recipeName}</h2>
            <p className="text-white/70 text-sm line-clamp-2 max-w-lg">{recipe.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />{total} min
              </span>
              <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
                <Users className="w-3.5 h-3.5 text-emerald-400" />{recipe.servingSize} servings
              </span>
              {recipe.rating > 0 && (
                <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{recipe.rating}
                </span>
              )}
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="hidden sm:flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 text-sm transition-all flex-shrink-0">
            View Recipe <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const RecipePage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  // Filters state
  const [searchQuery,  setSearchQuery]  = useState('');
  const [cuisine,      setCuisine]      = useState('All');
  const [difficulty,   setDifficulty]   = useState('All');
  const [prepTime,     setPrepTime]     = useState('all');
  const [dietary,      setDietary]      = useState('All');
  const [sortBy,       setSortBy]       = useState('rating');
  const [sortOrder,    setSortOrder]    = useState('desc');
  const [sortOpen,     setSortOpen]     = useState(false);
  const [filtersOpen,  setFiltersOpen]  = useState(false);
  const sortRef = useRef(null);

  const { recipes, isLoading, isError, message } = useSelector((s) => s.recipes);

  useEffect(() => {
    dispatch(getAllRecipes())
      .unwrap()
      .catch((err) => { if (err && !err.includes('No recipes found')) toast.error(err || 'Failed to fetch recipes'); });
  }, [dispatch]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Filtering + sorting ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return recipes
      .filter(r => {
        // Search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!r.recipeName?.toLowerCase().includes(q) &&
              !r.cuisineType?.toLowerCase().includes(q) &&
              !r.description?.toLowerCase().includes(q)) return false;
        }
        // Cuisine
        if (cuisine !== 'All' && r.cuisineType !== cuisine) return false;
        // Difficulty
        if (difficulty !== 'All' && r.difficultyLevel !== difficulty) return false;
        // Prep time
        if (prepTime !== 'all') {
          const total = (r.preparationTime || 0) + (r.cookingTime || 0);
          if (prepTime === '61') { if (total <= 60) return false; }
          else { if (total > parseInt(prepTime)) return false; }
        }
        // Dietary
        if (dietary !== 'All') {
          if (!r.dietaryRestrictions?.includes(dietary)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating')     return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
        if (sortBy === 'time') {
          const at = (a.preparationTime || 0) + (a.cookingTime || 0);
          const bt = (b.preparationTime || 0) + (b.cookingTime || 0);
          return sortOrder === 'desc' ? bt - at : at - bt;
        }
        if (sortBy === 'difficulty') {
          const order = { Easy: 1, Medium: 2, Hard: 3 };
          return sortOrder === 'desc' ? order[b.difficultyLevel] - order[a.difficultyLevel] : order[a.difficultyLevel] - order[b.difficultyLevel];
        }
        if (sortBy === 'newest') {
          return sortOrder === 'desc'
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0;
      });
  }, [recipes, searchQuery, cuisine, difficulty, prepTime, dietary, sortBy, sortOrder]);

  // Featured = top rated recipe
  const featured = useMemo(() => [...recipes].sort((a, b) => b.rating - a.rating)[0], [recipes]);

  const toggleSort = (key) => {
    if (sortBy === key) setSortOrder(o => o === 'desc' ? 'asc' : 'desc');
    else { setSortBy(key); setSortOrder('desc'); }
    setSortOpen(false);
  };

  const clearAll = () => {
    setSearchQuery(''); setCuisine('All'); setDifficulty('All');
    setPrepTime('all'); setDietary('All'); setSortBy('rating'); setSortOrder('desc');
  };

  const activeFilterCount = [
    cuisine !== 'All', difficulty !== 'All', prepTime !== 'all', dietary !== 'All',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 pt-20">
      <Header />

      {/* ── Hero banner ── */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img src={FOOD_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-stone-50/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/20 to-emerald-900/10" />

        {/* Floating thumbnails */}
        {[
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80',
        ].map((src, i) => (
          <div key={i} className={`absolute hidden md:block rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl ${i === 0 ? 'right-8 top-5 w-20 h-20 rotate-3' : 'right-32 top-10 w-16 h-16 -rotate-2'}`}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute bottom-10 left-4 sm:left-8 lg:left-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-[11px] font-bold tracking-widest uppercase">Community Recipes</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
            Discover <span className="text-emerald-400">Recipes</span>
          </h1>
          <p className="text-white/65 mt-2 text-sm max-w-sm">Explore dishes from our community. Filter by cuisine, time, and diet.</p>
        </div>

        <div className="absolute bottom-10 right-4 sm:right-8 hidden sm:flex gap-2">
          <div className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white font-bold text-base">{recipes.length}</span>
            <span className="text-white/70 text-xs ml-1.5">recipes</span>
          </div>
          <div className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white font-bold text-base">{filtered.length}</span>
            <span className="text-white/70 text-xs ml-1.5">showing</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Search + Sort + Filter toggle ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, cuisine, or description…"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 shadow-sm transition-all font-medium placeholder-gray-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button onClick={() => setFiltersOpen(v => !v)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border font-semibold text-sm shadow-sm transition-all
              ${filtersOpen || activeFilterCount > 0
                ? 'bg-[#3a5d8f] text-white border-[#3a5d8f] shadow-[#3a5d8f]/25'
                : 'bg-white/70 backdrop-blur-sm text-gray-700 border-white/60 hover:border-[#3a5d8f]/40'}`}>
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-white text-[#3a5d8f] rounded-full text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button onClick={() => setSortOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60 text-gray-700 font-semibold text-sm shadow-sm hover:border-[#3a5d8f]/40 transition-all whitespace-nowrap">
              <span>{SORT_OPTIONS.find(o => o.key === sortBy)?.icon}</span>
              {SORT_OPTIONS.find(o => o.key === sortBy)?.label}
              <span className="text-gray-400">{sortOrder === 'desc' ? '↓' : '↑'}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-20">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt.key} onClick={() => toggleSort(opt.key)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-all
                        ${sortBy === opt.key ? 'text-[#3a5d8f] bg-[#3a5d8f]/5' : 'text-gray-700 hover:bg-gray-50 hover:text-[#3a5d8f]'}`}>
                      <span>{opt.icon}</span>{opt.label}
                      {sortBy === opt.key && <span className="ml-auto text-xs text-gray-400">{sortOrder === 'desc' ? '↓' : '↑'}</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Filter panel ── */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              className="overflow-hidden mb-5">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                  {/* Cuisine */}
                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2.5">Cuisine</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CUISINES.map(c => (
                        <button key={c} onClick={() => setCuisine(c)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all
                            ${cuisine === c ? 'bg-[#3a5d8f] text-white border-[#3a5d8f]' : 'bg-white/60 text-gray-600 border-gray-200 hover:border-[#3a5d8f]/40 hover:text-[#3a5d8f]'}`}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2.5">Difficulty</p>
                    <div className="flex flex-wrap gap-1.5">
                      {DIFFICULTIES.map(d => (
                        <button key={d} onClick={() => setDifficulty(d)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all
                            ${difficulty === d
                              ? d === 'Easy' ? 'bg-emerald-500 text-white border-emerald-500'
                                : d === 'Medium' ? 'bg-amber-500 text-white border-amber-500'
                                : d === 'Hard' ? 'bg-red-500 text-white border-red-500'
                                : 'bg-[#3a5d8f] text-white border-[#3a5d8f]'
                              : 'bg-white/60 text-gray-600 border-gray-200 hover:border-[#3a5d8f]/40'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prep time */}
                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2.5">Prep Time</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PREP_TIMES.map(t => (
                        <button key={t.value} onClick={() => setPrepTime(t.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all
                            ${prepTime === t.value ? 'bg-[#3a5d8f] text-white border-[#3a5d8f]' : 'bg-white/60 text-gray-600 border-gray-200 hover:border-[#3a5d8f]/40'}`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dietary */}
                  <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2.5">Dietary</p>
                    <div className="flex flex-wrap gap-1.5">
                      {DIETARY.map(d => (
                        <button key={d} onClick={() => setDietary(d)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all
                            ${dietary === d ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/60 text-gray-600 border-gray-200 hover:border-emerald-400/40'}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear filters */}
                {activeFilterCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500 font-medium">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active · {filtered.length} results</p>
                    <button onClick={clearAll} className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                      <X className="w-3.5 h-3.5" /> Clear all
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Cuisine pill tabs (always visible) ── */}
        <div className="flex overflow-x-auto pb-1 gap-2 mb-6 scrollbar-hide">
          {CUISINES.map(c => (
            <button key={c} onClick={() => setCuisine(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all
                ${cuisine === c
                  ? 'bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white border-transparent shadow-md'
                  : 'bg-white/60 backdrop-blur-sm text-gray-600 border-white/50 hover:border-[#3a5d8f]/30 hover:text-[#3a5d8f]'}`}>
              {c}{c === 'All' ? ` (${recipes.length})` : ''}
            </button>
          ))}
        </div>

        {/* ── Loading skeletons ── */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Content ── */}
        {!isLoading && (
          <>
            {/* Featured recipe */}
            {cuisine === 'All' && !searchQuery && activeFilterCount === 0 && (
              <FeaturedRecipe recipe={featured} />
            )}

            {/* Results label */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-semibold text-gray-500">
                {filtered.length === 0 ? 'No recipes found' : `${filtered.length} recipe${filtered.length !== 1 ? 's' : ''}`}
                {searchQuery && <span className="text-gray-400"> for "{searchQuery}"</span>}
              </p>
              {(searchQuery || activeFilterCount > 0) && (
                <button onClick={clearAll} className="text-xs font-bold text-[#3a5d8f] hover:underline">Clear all</button>
              )}
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filtered.map((recipe, i) => (
                    <RecipeCard key={recipe._id} recipe={recipe} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 rounded-3xl flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Try adjusting your search or clearing some filters.</p>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={clearAll}
                  className="px-6 py-3 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all">
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RecipePage;