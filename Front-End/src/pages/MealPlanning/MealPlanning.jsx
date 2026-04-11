import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserMealPlans } from '../../features/mealPlanning/mealPlanningSlice';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-hot-toast';
import {
  ChevronLeft, ChevronRight, Plus, X, Clock, Users,
  Search, Utensils, Trash2, Coffee, Sun, Sunset, Moon,
  CalendarDays, Sparkles, ArrowRight, Save, Loader2,
  ShoppingCart, RefreshCw, Check, CheckCheck, Printer,
  Package, ShoppingBag,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, color: '#f59e0b', light: 'bg-amber-50 text-amber-700 border-amber-200'      },
  { id: 'lunch',     label: 'Lunch',     icon: Sun,    color: '#10b981', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'dinner',    label: 'Dinner',    icon: Moon,   color: '#3a5d8f', light: 'bg-blue-50 text-blue-700 border-blue-200'         },
  { id: 'snack',     label: 'Snack',     icon: Sunset, color: '#f43f5e', light: 'bg-rose-50 text-rose-700 border-rose-200'         },
];

import { USER_API } from '../../config/api';

const FOOD_BG   = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2053&q=80';
const PLAN_API  = `${USER_API}/weekly-plan`;
const SHOP_API  = `${USER_API}/shopping-list`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toMonday = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return date;
};

const buildWeekDates = (monday) =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

const toISO  = (d) => d.toISOString().split('T')[0];
const fmtDay = (d) => d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });

const buildEmptyDays = (monday) =>
  buildWeekDates(monday).map((date) => ({
    date: toISO(date), breakfast: null, lunch: null, dinner: null, snack: null,
  }));

const recipeSnapshot = (recipe) => recipe ? ({
  recipeId: recipe._id, recipeName: recipe.recipeName,
  recipeImage: recipe.recipeImage || null, cuisineType: recipe.cuisineType || '',
  preparationTime: recipe.preparationTime || 0, cookingTime: recipe.cookingTime || 0,
  servingSize: recipe.servingSize || 0, difficultyLevel: recipe.difficultyLevel || '',
}) : null;

const isSlotFilled = (slot) => !!(slot?.recipeId || slot?.recipeName);

const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
});

// ─── Print helper ─────────────────────────────────────────────────────────────
const printShoppingList = (items, weekLabel) => {
  const unchecked = items.filter(i => !i.isChecked);
  const checked   = items.filter(i => i.isChecked);
  const html = `
    <html><head><title>Shopping List — ${weekLabel}</title>
    <style>
      body { font-family: sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; }
      h1 { font-size: 24px; margin-bottom: 4px; }
      p  { font-size: 13px; color: #666; margin-bottom: 20px; }
      ul { list-style: none; padding: 0; }
      li { padding: 10px 0; border-bottom: 1px solid #eee; font-size: 15px; display: flex; justify-content: space-between; align-items: center; }
      .qty { font-weight: 700; color: #3a5d8f; background: #f0f4ff; padding: 2px 8px; border-radius: 12px; font-size: 13px; }
      .done { color: #aaa; text-decoration: line-through; }
      h2 { font-size: 13px; margin-top: 24px; color: #555; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; }
      .custom { font-size: 11px; background: #d1fae5; color: #065f46; padding: 1px 6px; border-radius: 999px; margin-left: 6px; }
    </style></head><body>
    <h1>🛒 Shopping List</h1>
    <p>Week of ${weekLabel} · ${items.length} items</p>
    <h2>To Buy (${unchecked.length})</h2>
    <ul>${unchecked.map(i => `
      <li>
        <span>☐ ${i.name}${i.isCustom ? '<span class="custom">custom</span>' : ''}</span>
        ${i.quantity > 0 || i.unit ? `<span class="qty">${i.quantity || ''} ${i.unit || ''}</span>` : ''}
      </li>`).join('')}
    </ul>
    ${checked.length ? `
      <h2>Already Have (${checked.length})</h2>
      <ul>${checked.map(i => `<li class="done"><span>${i.name}</span></li>`).join('')}</ul>
    ` : ''}
    </body></html>`;
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.print();
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const RecipeCard = ({ slot, onRemove }) => (
  <div className="relative group/card h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white border border-gray-100">
    {slot.recipeImage && (
      <div className="h-20 overflow-hidden">
        <img src={slot.recipeImage} alt={slot.recipeName}
          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
      </div>
    )}
    <div className="px-2 py-1.5">
      <p className="font-bold text-gray-800 line-clamp-1 text-[11px]">{slot.recipeName}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <Clock className="w-2.5 h-2.5 text-gray-400" />
        <span className="text-[10px] text-gray-400">{(slot.preparationTime || 0) + (slot.cookingTime || 0)}m</span>
      </div>
    </div>
    <button onClick={onRemove}
      className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all z-10">
      <X className="w-3 h-3" />
    </button>
  </div>
);

const EmptySlot = ({ onClick, disabled, color }) => (
  <button onClick={onClick} disabled={disabled}
    className="w-full h-full min-h-[96px] rounded-2xl border-2 border-dashed flex items-center justify-center transition-all group/slot"
    style={{ borderColor: disabled ? '#e5e7eb' : color + '35', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1 }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = color; }}
    onMouseLeave={e => { if (!disabled) e.currentTarget.style.borderColor = color + '35'; }}>
    <Plus className="w-4 h-4 transition-transform group-hover/slot:scale-125"
      style={{ color: disabled ? '#d1d5db' : color + '80' }} />
  </button>
);

// ─── Date Picker ──────────────────────────────────────────────────────────────
const DatePickerPopover = ({ currentMonday, onSelect, onClose }) => {
  const [viewDate, setViewDate] = useState(new Date(currentMonday));
  const [pickYear, setPickYear] = useState(false);
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const startCell = new Date(firstDay);
  startCell.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
  const cells = [];
  const cur = new Date(startCell);
  while (cur <= lastDay || cells.length % 7 !== 0) {
    cells.push(new Date(cur)); cur.setDate(cur.getDate() + 1);
    if (cells.length > 42) break;
  }
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const isCurrentWeek = (d) => toMonday(d).getTime() === currentMonday.getTime();
  const isToday       = (d) => d.toDateString() === new Date().toDateString();
  const yearOptions   = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i);
  return (
    <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.18 }}
      className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72"
      onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
        <button onClick={() => setPickYear(v => !v)} className="text-sm font-bold text-gray-800 hover:text-[#3a5d8f] px-2 py-1 rounded-lg hover:bg-gray-50">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </button>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
      </div>
      <AnimatePresence>
        {pickYear && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 gap-2 mb-3">
            {yearOptions.map(y => (
              <button key={y} onClick={() => { setViewDate(new Date(y, month, 1)); setPickYear(false); }}
                className={`py-2 rounded-xl text-sm font-semibold transition-all ${y === year ? 'bg-[#3a5d8f] text-white' : 'hover:bg-gray-100 text-gray-700'}`}>{y}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid grid-cols-7 mb-1">
        {['M','T','W','T','F','S','S'].map((d, i) => <div key={i} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>)}
      </div>
      <div className="space-y-0.5">
        {weeks.map((week, wi) => (
          <button key={wi} onClick={() => { onSelect(toMonday(week[0])); onClose(); }}
            className={`w-full grid grid-cols-7 rounded-xl transition-all group hover:bg-[#3a5d8f]/8 ${isCurrentWeek(week[0]) ? 'bg-[#3a5d8f]/10' : ''}`}>
            {week.map((d, di) => (
              <div key={di} className={`text-center py-1.5 text-xs font-semibold rounded-lg transition-all
                ${d.getMonth() !== month ? 'text-gray-300' : isToday(d) ? 'text-[#3a5d8f] font-black' : 'text-gray-700'}
                ${isCurrentWeek(d) ? 'text-[#3a5d8f]' : 'group-hover:text-[#3a5d8f]'}`}>
                {d.getDate()}
              </div>
            ))}
          </button>
        ))}
      </div>
      <p className="text-center text-[10px] text-gray-400 mt-3">Click a row to select that week</p>
    </motion.div>
  );
};

// ─── Shopping List Drawer ─────────────────────────────────────────────────────
const ShoppingDrawer = ({ isOpen, onClose, monday, plannedCount }) => {
  const [list,       setList]       = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [newItem,    setNewItem]    = useState({ name: '', quantity: '', unit: '' });
  const [saving,     setSaving]     = useState(false);

  const weekLabel = (() => {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  })();

  // Load list whenever drawer opens or week changes
  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(SHOP_API, {
          params: { startDate: toISO(monday) }, ...getConfig(),
        });
        setList(data);
      } catch {
        setList({ items: [] });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, monday]);

  const generate = async () => {
    setGenerating(true);
    try {
      const { data } = await axios.post(`${SHOP_API}/generate`, { startDate: toISO(monday) }, getConfig());
      setList(data);
      toast.success(`${data.items.length} items generated!`, { icon: '🛒' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate — make sure you have recipes assigned this week');
    } finally {
      setGenerating(false);
    }
  };

  const toggleItem = async (itemId) => {
    setList(prev => ({ ...prev, items: prev.items.map(i => i._id === itemId ? { ...i, isChecked: !i.isChecked } : i) }));
    try {
      const { data } = await axios.patch(`${SHOP_API}/toggle`, { startDate: toISO(monday), itemId }, getConfig());
      setList(data);
    } catch { toast.error('Failed to update'); }
  };

  const addCustomItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    setSaving(true);
    try {
      const { data } = await axios.post(`${SHOP_API}/item`, { startDate: toISO(monday), ...newItem }, getConfig());
      setList(data);
      setNewItem({ name: '', quantity: '', unit: '' });
      setShowForm(false);
      toast.success(`${newItem.name} added!`);
    } catch { toast.error('Failed to add item'); }
    finally { setSaving(false); }
  };

  const items     = list?.items || [];
  const total     = items.length;
  const checked   = items.filter(i => i.isChecked).length;
  const pct       = total ? Math.round((checked / total) * 100) : 0;
  const pending   = items.filter(i => !i.isChecked);
  const done      = items.filter(i => i.isChecked);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose} />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-gradient-to-b from-stone-50 to-white z-50 flex flex-col shadow-2xl border-l border-gray-100"
          >
            {/* Drawer header */}
            <div className="relative h-32 overflow-hidden flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/85 to-emerald-700/70" />
              <div className="absolute inset-0 flex items-center justify-between px-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300 text-[10px] font-bold uppercase tracking-widest">Week of {weekLabel}</span>
                  </div>
                  <h2 className="text-white text-xl font-black flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" /> Shopping List
                  </h2>
                  {total > 0 && (
                    <p className="text-white/70 text-xs mt-0.5">{checked}/{total} items checked off</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {total > 0 && (
                    <button onClick={() => printShoppingList(items, weekLabel)}
                      className="w-9 h-9 bg-white/20 hover:bg-white/35 text-white rounded-full flex items-center justify-center transition-all" title="Print">
                      <Printer className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={onClose}
                    className="w-9 h-9 bg-white/20 hover:bg-white/35 text-white rounded-full flex items-center justify-center transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Generate button */}
            <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={generate} disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/20 text-sm transition-all">
                {generating
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                  : <><RefreshCw className="w-4 h-4" /> {total > 0 ? 'Re-generate from plan' : 'Generate from this week\'s plan'}</>
                }
              </motion.button>
              {plannedCount === 0 && (
                <p className="text-center text-xs text-amber-600 mt-2 font-medium">
                  ⚠ Assign recipes to your meal plan first
                </p>
              )}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-7 h-7 animate-spin text-[#3a5d8f]" />
                </div>
              )}

              {/* Empty state */}
              {!loading && total === 0 && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-3xl flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="font-semibold text-gray-600 text-sm">No items yet</p>
                  <p className="text-gray-400 text-xs mt-1">Generate from your meal plan or add items manually.</p>
                </div>
              )}

              {/* Progress */}
              {!loading && total > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#3a5d8f]" />
                      <span className="text-sm font-bold text-gray-800">{total - checked} remaining</span>
                    </div>
                    <span className="text-lg font-black bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-[#3a5d8f] to-emerald-500 rounded-full"
                      animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
                  </div>
                  {pct === 100 && (
                    <p className="text-emerald-600 text-xs font-bold text-center mt-2 flex items-center justify-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" /> All done! Happy shopping 🎉
                    </p>
                  )}
                </div>
              )}

              {/* To buy */}
              {!loading && pending.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
                    <ShoppingCart className="w-3.5 h-3.5 text-[#3a5d8f]" />
                    <span className="text-xs font-black text-gray-700 uppercase tracking-widest">To Buy</span>
                    <span className="text-[10px] bg-[#3a5d8f]/10 text-[#3a5d8f] px-2 py-0.5 rounded-full font-bold ml-auto">{pending.length}</span>
                  </div>
                  <ul className="divide-y divide-gray-50">
                    <AnimatePresence>
                      {pending.map(item => (
                        <motion.li key={item._id} layout
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors group">
                          <button onClick={() => toggleItem(item._id)}
                            className="w-5 h-5 rounded-md border-2 border-gray-300 hover:border-emerald-500 flex items-center justify-center flex-shrink-0 transition-all">
                            <Check className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-60 transition-opacity" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                            {item.isCustom && (
                              <span className="ml-1.5 text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">custom</span>
                            )}
                            {item.recipeNames?.length > 0 && (
                              <p className="text-[10px] text-gray-400 truncate">{item.recipeNames.join(', ')}</p>
                            )}
                          </div>
                          {(item.quantity > 0 || item.unit) && (
                            <span className="text-[11px] font-bold text-[#3a5d8f] bg-[#3a5d8f]/8 px-2 py-0.5 rounded-full flex-shrink-0">
                              {item.quantity > 0 ? item.quantity : ''} {item.unit}
                            </span>
                          )}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              )}

              {/* Done */}
              {!loading && done.length > 0 && (
                <div className="bg-gray-50/60 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">In Basket</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-bold ml-auto">{done.length}</span>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {done.map(item => (
                        <motion.li key={item._id} layout
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/60 transition-colors">
                          <button onClick={() => toggleItem(item._id)}
                            className="w-5 h-5 rounded-md bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center flex-shrink-0 transition-all shadow-sm">
                            <Check className="w-3 h-3 text-white" />
                          </button>
                          <span className="text-sm text-gray-400 line-through flex-1">{item.name}</span>
                          {(item.quantity > 0 || item.unit) && (
                            <span className="text-[11px] text-gray-300 flex-shrink-0">{item.quantity > 0 ? item.quantity : ''} {item.unit}</span>
                          )}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              )}

              {/* Add custom item */}
              <AnimatePresence>
                {showForm ? (
                  <motion.form initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    onSubmit={addCustomItem}
                    className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Add Custom Item</p>
                    <input type="text" placeholder="Item name *" required
                      value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all font-medium placeholder-gray-400" />
                    <div className="flex gap-2">
                      <input type="number" placeholder="Qty" min="0" step="0.1"
                        value={newItem.quantity} onChange={e => setNewItem(p => ({ ...p, quantity: e.target.value }))}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 transition-all placeholder-gray-400" />
                      <input type="text" placeholder="Unit (g, ml, pcs…)"
                        value={newItem.unit} onChange={e => setNewItem(p => ({ ...p, unit: e.target.value }))}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 transition-all placeholder-gray-400" />
                    </div>
                    <div className="flex gap-2">
                      <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white font-bold rounded-xl text-sm shadow-md disabled:opacity-60">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Add Item
                      </motion.button>
                      <button type="button" onClick={() => setShowForm(false)}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl text-sm transition-all">
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-dashed border-[#3a5d8f]/20 hover:border-[#3a5d8f]/50 hover:bg-[#3a5d8f]/3 text-[#3a5d8f] font-semibold rounded-2xl text-sm transition-all group">
                    <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
                    Add a custom item
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MealPlanning = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((s) => s.auth);
  const { mealPlans, isLoading: recipesLoading } = useSelector((s) => s.mealPlanning);

  const [monday,       setMonday]       = useState(() => toMonday(new Date()));
  const [days,         setDays]         = useState(() => buildEmptyDays(toMonday(new Date())));
  const [planLoading,  setPlanLoading]  = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [modal,        setModal]        = useState(null);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [datePicker,   setDatePicker]   = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);  // ← shopping list drawer
  const searchRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => { dispatch(getUserMealPlans()); }, [dispatch]);

  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setDatePicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    const load = async () => {
      setPlanLoading(true);
      try {
        const { data } = await axios.get(PLAN_API, {
          params: { startDate: toISO(monday) },
          headers: { Authorization: `Bearer ${token}` },
        });
        const normalized = buildWeekDates(monday).map((date, i) => {
          const backendDay = data.days?.[i];
          return {
            date:      toISO(date),
            breakfast: isSlotFilled(backendDay?.breakfast) ? backendDay.breakfast : null,
            lunch:     isSlotFilled(backendDay?.lunch)     ? backendDay.lunch     : null,
            dinner:    isSlotFilled(backendDay?.dinner)    ? backendDay.dinner    : null,
            snack:     isSlotFilled(backendDay?.snack)     ? backendDay.snack     : null,
          };
        });
        setDays(normalized);
      } catch { setDays(buildEmptyDays(monday)); }
      finally { setPlanLoading(false); }
    };
    load();
  }, [monday, user]);

  useEffect(() => {
    if (modal) setTimeout(() => searchRef.current?.focus(), 120);
    else setSearchQuery('');
  }, [modal]);

  const shiftWeek   = (delta) => { const next = new Date(monday); next.setDate(monday.getDate() + delta * 7); setMonday(next); };
  const goToThisWeek = () => setMonday(toMonday(new Date()));
  const isThisWeek   = monday.toDateString() === toMonday(new Date()).toDateString();

  const savePlan = useCallback(async (updatedDays) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    setSaving(true);
    try {
      await axios.post(PLAN_API, { startDate: toISO(monday), days: updatedDays }, { headers: { Authorization: `Bearer ${token}` } });
    } catch { toast.error('Failed to save plan'); }
    finally { setSaving(false); }
  }, [monday]);

  const assignRecipe = (recipe) => {
    if (!modal) return;
    const updated = days.map((day, i) => i === modal.dayIndex ? { ...day, [modal.mealId]: recipeSnapshot(recipe) } : day);
    setDays(updated); savePlan(updated); setModal(null);
    toast.success(`${recipe.recipeName} added!`, { icon: '🍽️' });
  };

  const removeSlot = (dayIndex, mealId) => {
    const updated = days.map((day, i) => i === dayIndex ? { ...day, [mealId]: null } : day);
    setDays(updated); savePlan(updated);
  };

  const clearDay = async (dayIndex) => {
    const updated = days.map((day, i) => i === dayIndex ? { ...day, breakfast: null, lunch: null, dinner: null, snack: null } : day);
    setDays(updated); await savePlan(updated);
    toast.success(`${fmtDay(new Date(days[dayIndex].date))} cleared`);
  };

  const clearWeek = async () => { const updated = buildEmptyDays(monday); setDays(updated); await savePlan(updated); toast.success('Week cleared'); };

  const weekDates    = buildWeekDates(monday);
  const todayStr     = toISO(new Date());
  const plannedCount = days.reduce((t, d) => t + MEAL_TYPES.filter(m => isSlotFilled(d[m.id])).length, 0);

  const filteredRecipes = mealPlans.filter(r => {
    const q = searchQuery.toLowerCase();
    return r.recipeName?.toLowerCase().includes(q) || r.cuisineType?.toLowerCase().includes(q);
  });

  if (recipesLoading) return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 border-4 border-[#3a5d8f]/20 border-t-[#3a5d8f] rounded-2xl" />
      </div>
    </div>
  );

  if (!user?.isApproved) return (
    <div className="min-h-screen pt-20 bg-stone-50">
      <Header />
      <div className="flex items-center justify-center h-[70vh] px-4">
        <div className="bg-white rounded-3xl p-12 text-center shadow-xl max-w-sm">
          <CalendarDays className="w-12 h-12 text-[#3a5d8f] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pending Approval</h2>
          <p className="text-gray-500 mb-6 text-sm">You'll be able to plan meals once your account is approved.</p>
          <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-[#3a5d8f] text-white font-bold rounded-xl">Go to Dashboard</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <Header />

      {/* ── Hero ── */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img src={FOOD_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-stone-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/20 to-emerald-900/10" />
        {[
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80',
        ].map((src, i) => (
          <div key={i} className={`absolute hidden md:block rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl
            ${i === 0 ? 'right-6 top-5 w-24 h-24 rotate-3' : i === 1 ? 'right-36 top-8 w-20 h-20 -rotate-2' : 'right-64 top-14 w-16 h-16 rotate-1 hidden lg:block'}`}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute bottom-10 left-4 sm:left-8 lg:left-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-xs font-bold tracking-widest uppercase">Weekly Planner</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
            Plan Your <span className="text-emerald-400">Week</span>
          </h1>
          <p className="text-white/65 mt-2 text-sm max-w-sm">Pick any start date, assign your saved recipes, auto-saved to your account.</p>
        </div>
        <div className="absolute bottom-10 right-4 sm:right-8 hidden sm:flex gap-2">
          <div className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white font-bold text-base">{plannedCount}</span>
            <span className="text-white/70 text-xs ml-1.5">meals planned</span>
          </div>
          <div className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white font-bold text-base">{mealPlans.length}</span>
            <span className="text-white/70 text-xs ml-1.5">saved recipes</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8 py-8">

        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Week nav + date picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => shiftWeek(-1)} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-[#3a5d8f]/40 hover:text-[#3a5d8f] shadow-sm transition-all"><ChevronLeft className="w-4 h-4" /></button>
            <div className="relative" ref={pickerRef}>
              <button onClick={() => setDatePicker(v => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl shadow-sm transition-all min-w-[200px] justify-center ${datePicker ? 'border-[#3a5d8f] ring-2 ring-[#3a5d8f]/15' : 'border-gray-200 hover:border-[#3a5d8f]/40'}`}>
                <CalendarDays className="w-4 h-4 text-[#3a5d8f]" />
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide leading-none mb-0.5">{monday.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  <p className="text-sm font-bold text-gray-800 leading-none">{weekDates[0].getDate()} – {weekDates[6].getDate()}</p>
                </div>
                {isThisWeek && <span className="text-[9px] bg-[#3a5d8f] text-white px-1.5 py-0.5 rounded-full font-bold">NOW</span>}
              </button>
              <AnimatePresence>
                {datePicker && <DatePickerPopover currentMonday={monday} onSelect={(m) => { setMonday(m); }} onClose={() => setDatePicker(false)} />}
              </AnimatePresence>
            </div>
            <button onClick={() => shiftWeek(1)} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-[#3a5d8f]/40 hover:text-[#3a5d8f] shadow-sm transition-all"><ChevronRight className="w-4 h-4" /></button>
            {!isThisWeek && <button onClick={goToThisWeek} className="px-3 py-2 text-xs font-bold text-[#3a5d8f] bg-[#3a5d8f]/8 border border-[#3a5d8f]/20 rounded-xl hover:bg-[#3a5d8f]/15 transition-all">Today</button>}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Save status */}
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${saving ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : <><Save className="w-3.5 h-3.5" /> Saved</>}
            </div>
            {/* Progress */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-[#3a5d8f] to-emerald-500"
                  animate={{ width: `${(plannedCount / 28) * 100}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
              </div>
              <span className="text-xs font-bold text-gray-500">{plannedCount}<span className="text-gray-300">/28</span></span>
            </div>
            {/* 🛒 Shopping List button */}
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-[#3a5d8f] hover:from-emerald-600 hover:to-[#2c4a75] text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 text-sm transition-all">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Shopping List</span>
            </motion.button>
            {plannedCount > 0 && (
              <button onClick={clearWeek} className="flex items-center gap-1.5 px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 font-semibold rounded-xl border border-red-200 text-xs transition-all">   <X className="w-3.5 h-3.5" /> Clear week </button>
            )}
          </div>
        </div>

        {/* ── No recipes nudge ── */}
        {mealPlans.length === 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0"><Utensils className="w-4 h-4 text-amber-600" /></div>
            <div className="flex-1">
              <p className="font-bold text-amber-900 text-sm">No saved recipes yet</p>
              <p className="text-amber-700 text-xs">Create recipes in My Kitchen first, then plan your week here.</p>
            </div>
            <button onClick={() => navigate('/my-recipes')} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs whitespace-nowrap transition-all">
              My Kitchen <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* ── Meal legend ── */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {MEAL_TYPES.map(({ id, label, icon: Icon, light }) => (
            <div key={id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border flex-shrink-0 ${light}`}>
              <Icon className="w-3 h-3" />{label}
            </div>
          ))}
        </div>

        {/* ── Loading overlay ── */}
        <AnimatePresence>
          {planLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin text-[#3a5d8f]" />
                <span className="font-medium">Loading your plan…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Calendar Grid ── */}
        {!planLoading && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/40">
              {weekDates.map((date, di) => {
                const isToday  = toISO(date) === todayStr;
                const dayCount = MEAL_TYPES.filter(m => isSlotFilled(days[di]?.[m.id])).length;
                return (
                  <div key={di} className={`py-3 px-2 text-center border-r last:border-r-0 border-gray-100 relative ${isToday ? 'bg-gradient-to-b from-[#3a5d8f]/8 to-transparent' : ''}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-[#3a5d8f]' : 'text-gray-400'}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className={`text-xl font-black mt-0.5 leading-none ${isToday ? 'text-[#3a5d8f]' : 'text-gray-700'}`}>{date.getDate()}</p>
                    <p className={`text-[9px] mt-0.5 ${isToday ? 'text-[#3a5d8f]/60' : 'text-gray-400'}`}>{date.toLocaleDateString('en-US', { month: 'short' })}</p>
                    {isToday && <div className="w-1.5 h-1.5 bg-[#3a5d8f] rounded-full mx-auto mt-1" />}
                    {dayCount > 0 && (
                      <button onClick={() => clearDay(di)} title="Clear day" className="absolute top-2 right-2 w-4 h-4 text-gray-300 hover:text-red-400 transition-colors">
                        <X className="w-full h-full" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Meal rows */}
            {MEAL_TYPES.map(({ id, color }, mi) => (
              <div key={id} className={`grid grid-cols-7 ${mi < MEAL_TYPES.length - 1 ? 'border-b border-gray-100' : ''}`}>
                {days.map((day, di) => {
                  const slot = day[id];
                  return (
                    <div key={di} className={`p-2 border-r last:border-r-0 border-gray-100 min-h-[108px] ${day.date === todayStr ? 'bg-[#3a5d8f]/[0.018]' : ''}`}>
                      {isSlotFilled(slot)
                        ? <RecipeCard slot={slot} onRemove={() => removeSlot(di, id)} />
                        : <EmptySlot onClick={() => setModal({ dayIndex: di, mealId: id })} disabled={mealPlans.length === 0} color={color} />
                      }
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* ── Per-meal coverage pills ── */}
        {!planLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {MEAL_TYPES.map(({ id, label, icon: Icon, light }) => {
              const count = days.filter(d => isSlotFilled(d[id])).length;
              return (
                <div key={id} className={`flex items-center gap-3 p-3 rounded-2xl border ${light}`}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/60"><Icon className="w-4 h-4" /></div>
                  <div><p className="text-xs font-bold">{label}</p><p className="text-[10px] opacity-70">{count}/7 days</p></div>
                  <div className="ml-auto w-10 h-1.5 bg-white/60 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-current opacity-40" style={{ width: `${(count / 7) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Completion banner ── */}
        {plannedCount >= 5 && !planLoading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 relative overflow-hidden rounded-3xl">
            <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/88 to-emerald-700/78" />
            <div className="relative px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest">Looking great!</p>
                <h3 className="text-white text-xl font-black mt-0.5">{plannedCount} meals planned 🎉</h3>
              </div>
              {/* Shopping list CTA in banner */}
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 text-sm transition-all">
                <ShoppingCart className="w-4 h-4" /> Generate Shopping List
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />

      {/* ── Shopping List Drawer ── */}
      <ShoppingDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        monday={monday}
        plannedCount={plannedCount}
      />

      {/* ── Recipe Picker Modal ── */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setModal(null)} />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.97 }} transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
              className="fixed inset-x-3 bottom-3 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[560px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
              style={{ maxHeight: '82vh' }}>
              <div className="relative h-24 overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/85 to-emerald-700/65" />
                <div className="absolute inset-0 flex items-center justify-between px-5">
                  <div>
                    <p className="text-white/75 text-[11px] font-bold uppercase tracking-widest">
                      {days[modal.dayIndex] && fmtDay(new Date(days[modal.dayIndex].date))} · {MEAL_TYPES.find(m => m.id === modal.mealId)?.label}
                    </p>
                    <h3 className="text-white text-xl font-black mt-0.5">Choose a Recipe</h3>
                  </div>
                  <button onClick={() => setModal(null)} className="w-9 h-9 bg-white/20 hover:bg-white/35 text-white rounded-full flex items-center justify-center transition-all"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input ref={searchRef} type="text" placeholder="Search by name or cuisine…"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:bg-white transition-all" />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-3 space-y-2">
                {filteredRecipes.length === 0 ? (
                  <div className="text-center py-14">
                    <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    <p className="font-semibold text-gray-500 text-sm">No recipes found</p>
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="text-sm text-[#3a5d8f] mt-2 hover:underline">Clear search</button>}
                  </div>
                ) : filteredRecipes.map(recipe => (
                  <motion.button key={recipe._id} whileHover={{ x: 3 }} whileTap={{ scale: 0.99 }}
                    onClick={() => assignRecipe(recipe)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                      {recipe.recipeImage
                        ? <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        : <div className="w-full h-full flex items-center justify-center"><Utensils className="w-6 h-6 text-gray-300" /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate text-sm">{recipe.recipeName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{recipe.cuisineType}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{(recipe.preparationTime || 0) + (recipe.cookingTime || 0)} min
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${recipe.difficultyLevel === 'Easy' ? 'bg-emerald-100 text-emerald-700' : recipe.difficultyLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{recipe.difficultyLevel}</span>
                        {recipe.servingSize && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Users className="w-2.5 h-2.5" />{recipe.servingSize}</span>}
                      </div>
                    </div>

            
                    <div className="w-8 h-8 bg-[#3a5d8f]/8 group-hover:bg-[#3a5d8f] rounded-full flex items-center justify-center transition-all flex-shrink-0">
                      <Plus className="w-4 h-4 text-[#3a5d8f] group-hover:text-white transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex-shrink-0">
                <button onClick={() => { setModal(null); navigate('/my-recipes'); }}
                  className="w-full py-2.5 text-sm font-semibold text-[#3a5d8f] hover:bg-[#3a5d8f]/8 rounded-xl transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Create a new recipe in My Kitchen
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealPlanning;