import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RecipeReviews from '../../components/RecipeReviews/RecipeReviews';
import {
  ArrowLeft, Clock, Users, Star, Utensils, Flame,
  ChefHat, Leaf, CalendarDays, Check, X, Loader2, Sparkles,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
import { USER_API } from '../../config/api.js';
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_LABELS = {
  breakfast: { label: 'Breakfast', emoji: '🌅' },
  lunch:     { label: 'Lunch',     emoji: '☀️'  },
  dinner:    { label: 'Dinner',    emoji: '🌙'  },
  snack:     { label: 'Snack',     emoji: '🍎'  },
};
const DIFF_STYLE = {
  Easy:   { text: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  Medium: { text: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200'   },
  Hard:   { text: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200'     },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toMonday = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return date;
};
const toISO = (d) => d.toISOString().split('T')[0];

// ─── Add to Plan Dropdown ─────────────────────────────────────────────────────
const AddToPlanDropdown = ({ recipe, buttonRef, onClose }) => {
  const [monday,  setMonday]  = useState(() => toMonday(new Date()));
  const [meal,    setMeal]    = useState('dinner');
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [dropTop,  setDropTop]  = useState(200);
  const [dropLeft, setDropLeft] = useState(100);

  // Calculate position from button on mount
  useEffect(() => {
    if (buttonRef?.current) {
      const r = buttonRef.current.getBoundingClientRect();
      setDropTop(r.bottom + 8);
      setDropLeft(r.left);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (buttonRef?.current && !buttonRef.current.contains(e.target)) {
        onClose();
      }
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const weekLabel  = `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  const isThisWeek = toISO(monday) === toISO(toMonday(new Date()));

  const shiftWeek = (delta) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + delta * 7);
    setMonday(d);
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) { toast.error('Please log in first'); return; }
    setSaving(true);
    try {
      const { data: plan } = await axios.get(PLAN_API, {
        params:  { startDate: toISO(monday) },
        headers: { Authorization: `Bearer ${token}` },
      });

      const days = Array.from({ length: 7 }, (_, i) => {
        const existing = plan.days?.[i] || {};
        return {
          date:      toISO(weekDates[i]),
          breakfast: existing.breakfast || null,
          lunch:     existing.lunch     || null,
          dinner:    existing.dinner    || null,
          snack:     existing.snack     || null,
        };
      });

      const targetIdx = days.findIndex(d => !d[meal]?.recipeId);
      if (targetIdx === -1) {
        toast.error(`All ${meal} slots this week are full`);
        setSaving(false);
        return;
      }

      days[targetIdx][meal] = {
        recipeId:        recipe._id,
        recipeName:      recipe.recipeName,
        recipeImage:     recipe.recipeImage     || null,
        cuisineType:     recipe.cuisineType     || '',
        preparationTime: recipe.preparationTime || 0,
        cookingTime:     recipe.cookingTime     || 0,
        servingSize:     recipe.servingSize     || 0,
        difficultyLevel: recipe.difficultyLevel || '',
      };

      await axios.post(
        PLAN_API,
        { startDate: toISO(monday), days },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      toast.success(`${recipe.recipeName} added to ${MEAL_LABELS[meal].label}! 🍽️`);
      setTimeout(() => { setSuccess(false); onClose(); }, 1800);
    } catch (err) {
      console.error('Add to plan error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to add to plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      style={{ position: 'fixed', top: dropTop, left: dropLeft, zIndex: 9999 }}
      className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      {/* Header strip */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-sm">Add to Meal Plan</span>
        </div>
        <button onClick={onClose}
          className="w-6 h-6 bg-white/20 hover:bg-white/35 text-white rounded-full flex items-center justify-center transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Success state */}
      {success ? (
        <div className="p-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-emerald-600" />
          </motion.div>
          <p className="font-bold text-gray-900 text-sm">Added!</p>
          <p className="text-gray-400 text-xs mt-0.5">{MEAL_LABELS[meal].emoji} {MEAL_LABELS[meal].label} · {weekLabel}</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">

          {/* Week nav */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
            <button onClick={() => shiftWeek(-1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500 font-bold text-lg">
              ‹
            </button>
            <div className="flex-1 text-center">
              <p className="text-xs font-bold text-gray-800 leading-none">{weekLabel}</p>
              {isThisWeek && <p className="text-[10px] text-[#3a5d8f] font-bold mt-0.5">This week</p>}
            </div>
            <button onClick={() => shiftWeek(1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-500 font-bold text-lg">
              ›
            </button>
          </div>

          {/* Meal type selector */}
          <div className="grid grid-cols-2 gap-1.5">
            {MEAL_TYPES.map(m => (
              <button key={m} onClick={() => setMeal(m)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all
                  ${meal === m
                    ? 'bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white border-transparent shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#3a5d8f]/40 hover:text-[#3a5d8f]'
                  }`}>
                <span>{MEAL_LABELS[m].emoji}</span>
                {MEAL_LABELS[m].label}
              </button>
            ))}
          </div>

          {/* Confirm button */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleAdd} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 disabled:opacity-60 text-white font-bold rounded-xl shadow-md text-sm transition-all">
            {saving
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding…</>
              : <><CalendarDays className="w-3.5 h-3.5" /> Add to {MEAL_LABELS[meal].label}</>
            }
          </motion.button>

          <p className="text-center text-[10px] text-gray-400">
            Adds to first available {MEAL_LABELS[meal].label.toLowerCase()} slot this week
          </p>
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const RecipeView = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { recipes } = useSelector((s) => s.recipes);

  const [recipe,       setRecipe]       = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const addBtnRef = useRef(null);

  useEffect(() => {
    const found = recipes.find(r => r._id === id);
    if (found) {
      setRecipe(found);
    } else {
      toast.error('Recipe not found');
      navigate('/recipes');
    }
    setLoading(false);
  }, [id, recipes, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 pt-20">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh] gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#3a5d8f]/20 border-t-[#3a5d8f] rounded-2xl" />
        <span className="text-gray-500 font-medium">Loading recipe…</span>
      </div>
      <Footer />
    </div>
  );

  if (!recipe) return null;

  const totalTime = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);
  const diffStyle = DIFF_STYLE[recipe.difficultyLevel] || DIFF_STYLE.Medium;
  const steps     = recipe.instructions
    ? recipe.instructions.split('\n').filter(s => s.trim()).map(s => s.replace(/^\d+\.\s*/, '').trim())
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 pt-20">
      {/* Dot pattern */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <Header />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back */}
        <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/60 text-gray-600 hover:text-[#3a5d8f] font-semibold rounded-xl shadow-sm hover:shadow-md text-sm mb-6 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </motion.button>

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 shadow-2xl shadow-[#3a5d8f]/8 mb-8">
          <div className="grid lg:grid-cols-2">

            {/* Image */}
            <div className="relative h-72 lg:h-auto min-h-[320px] overflow-hidden group">
              {recipe.recipeImage ? (
                <img src={recipe.recipeImage} alt={recipe.recipeName}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#3a5d8f] shadow-md">
                  <ChefHat className="w-3 h-3" /> {recipe.cuisineType}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-sm border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                  <Flame className="w-3 h-3" /> {recipe.difficultyLevel}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-7 lg:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  {recipe.cuisineType} · {recipe.difficultyLevel}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-3">
                {recipe.recipeName}
              </h1>
              <p className="text-gray-500 leading-relaxed mb-6 text-sm">{recipe.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: Clock,  value: `${totalTime} min`,             label: 'Total Time',  color: 'text-amber-500'   },
                  { icon: Users,  value: `${recipe.servingSize}`,         label: 'Servings',    color: 'text-emerald-500' },
                  { icon: Flame,  value: recipe.difficultyLevel,          label: 'Difficulty',  color: diffStyle.text     },
                  { icon: Star,   value: (recipe.rating || 0).toFixed(1), label: 'Rating',      color: 'text-amber-500'   },
                ].map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className="bg-white/50 backdrop-blur-sm rounded-2xl p-3 border border-white/60 text-center shadow-sm">
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
                    <p className="font-black text-gray-900 text-base leading-none">{value}</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Dietary tags */}
              {recipe.dietaryRestrictions?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.dietaryRestrictions.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                      <Leaf className="w-3 h-3" />{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Add to Meal Plan button */}
              <div>
                <motion.button
                  ref={addBtnRef}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const token = localStorage.getItem('userToken');
                    if (!token) { toast.error('Please log in to add to your meal plan'); return; }
                    setShowDropdown(v => !v);
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all">
                  <CalendarDays className="w-4 h-4" />
                  Add to Meal Plan
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Ingredients — sticky */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-white/40 flex items-center gap-3 bg-white/30">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                  <ChefHat className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">Ingredients</h2>
                  <p className="text-[11px] text-gray-400">For {recipe.servingSize} servings</p>
                </div>
              </div>
              <ul className="p-4 space-y-1.5">
                {recipe.ingredients?.map((ing, i) => (
                  <motion.li key={i}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/60 transition-colors group">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 flex-shrink-0" />
                    <div className="flex items-baseline gap-1.5 flex-1 min-w-0">
                      <span className="font-black text-gray-900 text-sm whitespace-nowrap">{ing.quantity}</span>
                      {ing.unit && <span className="text-xs text-gray-400 font-semibold uppercase whitespace-nowrap">{ing.unit}</span>}
                      <span className="text-gray-700 text-sm font-medium truncate group-hover:text-[#3a5d8f] transition-colors">{ing.name}</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Instructions + Tags + Reviews */}
          <div className="lg:col-span-8 space-y-6">

            {/* Instructions */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-white/40 flex items-center gap-3 bg-white/30">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">Instructions</h2>
                  <p className="text-[11px] text-gray-400">{steps.length} step{steps.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {steps.length > 0 ? steps.map((step, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07 }}
                    className="flex gap-4 group">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-md shadow-[#3a5d8f]/20 group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-px flex-1 bg-gradient-to-b from-[#3a5d8f]/20 to-transparent mt-2 min-h-[16px]" />
                      )}
                    </div>
                    <div className="pt-1 pb-3">
                      <p className="text-gray-700 leading-relaxed text-sm group-hover:text-gray-900 transition-colors">{step}</p>
                    </div>
                  </motion.div>
                )) : (
                  <p className="text-gray-400 text-sm italic text-center py-4">No instructions provided.</p>
                )}
              </div>
            </motion.div>

            {/* Tags */}
            {recipe.tags?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-md">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="font-bold text-gray-900 text-base">Perfect For</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, i) => (
                    <motion.span key={tag}
                      initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.04 }}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-semibold rounded-full text-xs border border-emerald-200 shadow-sm">
                      #{tag.replace(/\s+/g, '')}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <RecipeReviews recipeId={id} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Add to Plan Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <AddToPlanDropdown
            recipe={recipe}
            buttonRef={addBtnRef}
            onClose={() => setShowDropdown(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeView;