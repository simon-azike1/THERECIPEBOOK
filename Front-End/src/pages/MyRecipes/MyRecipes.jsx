import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserMealPlans, deleteMealPlan, updateMealPlan } from '../../features/mealPlanning/mealPlanningSlice';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-hot-toast';
import CreateRecipeModal from '../../components/CreateRecipeModal/CreateRecipeModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Edit2, Trash2, Eye, Clock, ChefHat,
  Flame, Utensils, BookOpen, Star, Users, Sparkles, X,
} from 'lucide-react';

const FOOD_BG = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2070&q=80';

const DIFF_STYLE = {
  Easy:   'bg-emerald-100/90 text-emerald-700',
  Medium: 'bg-amber-100/90 text-amber-700',
  Hard:   'bg-red-100/90 text-red-700',
};

// ─── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50 animate-pulse">
    <div className="h-52 bg-gray-200/80" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200/80 rounded-full w-3/4" />
      <div className="h-4 bg-gray-200/80 rounded-full w-1/2" />
      <div className="h-3 bg-gray-200/80 rounded-full w-full" />
      <div className="h-3 bg-gray-200/80 rounded-full w-2/3" />
      <div className="flex gap-2 pt-2">
        <div className="h-9 bg-gray-200/80 rounded-xl flex-1" />
        <div className="h-9 bg-gray-200/80 rounded-xl flex-1" />
        <div className="h-9 bg-gray-200/80 rounded-xl flex-1" />
      </div>
    </div>
  </div>
);

// ─── Recipe card ───────────────────────────────────────────────────────────────
const RecipeCard = ({ recipe, index, onEdit, onDelete }) => {
  const totalTime = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.35 }}
      className="group bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 shadow-md hover:shadow-2xl hover:shadow-[#3a5d8f]/10 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        {recipe.recipeImage ? (
          <img src={recipe.recipeImage} alt={recipe.recipeName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Utensils className="w-12 h-12 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Cuisine badge */}
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-[#3a5d8f] shadow-sm">
            <ChefHat className="w-3 h-3" />{recipe.cuisineType}
          </span>
        </div>

        {/* Difficulty badge */}
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
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-[#3a5d8f] transition-colors mb-1">
          {recipe.recipeName}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />{totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-500" />{recipe.servingSize} servings
          </span>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
          {recipe.description}
        </p>

        {/* Dietary tags */}
        {recipe.dietaryRestrictions?.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-4">
            {recipe.dietaryRestrictions.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-[#3a5d8f]/8 text-[#3a5d8f] rounded-full border border-[#3a5d8f]/15">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100/80">
          <Link to={`/recipe/${recipe._id}`}
            className="flex items-center justify-center gap-1.5 py-2 bg-[#3a5d8f]/8 hover:bg-[#3a5d8f] text-[#3a5d8f] hover:text-white rounded-xl font-semibold text-xs transition-all">
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </Link>
          <button onClick={() => onEdit(recipe)}
            className="flex items-center justify-center gap-1.5 py-2 bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white rounded-xl font-semibold text-xs transition-all">
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button onClick={() => onDelete(recipe._id)}
            className="flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-semibold text-xs transition-all">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const MyRecipes = () => {
  const dispatch = useDispatch();
  const { mealPlans, isLoading } = useSelector((s) => s.mealPlanning);

  const [searchQuery,      setSearchQuery]      = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen,   setIsEditModalOpen]   = useState(false);
  const [editingRecipe,     setEditingRecipe]     = useState(null);

  useEffect(() => {
    dispatch(getUserMealPlans())
      .unwrap()
      .catch(err => toast.error(err || 'Failed to fetch recipes'));
  }, [dispatch]);

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Delete this recipe? This cannot be undone.')) return;
    try {
      await dispatch(deleteMealPlan(recipeId)).unwrap();
      toast.success('Recipe deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      await dispatch(updateMealPlan({ id: editingRecipe._id, updateData: updatedData })).unwrap();
      toast.success('Recipe updated!');
      setIsEditModalOpen(false);
      setEditingRecipe(null);
    } catch (err) {
      toast.error(err || 'Failed to update');
    }
  };

  const filtered = mealPlans.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.recipeName?.toLowerCase().includes(q) ||
      r.cuisineType?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 pt-20">
      {/* Dot pattern */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <Header />

      {/* ── Hero banner ── */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img src={FOOD_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-stone-50/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/20 to-emerald-900/10" />

        {/* Floating thumbnails */}
        {mealPlans.slice(0, 2).map((r, i) => r.recipeImage && (
          <div key={i} className={`absolute hidden md:block rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl
            ${i === 0 ? 'right-8 top-5 w-20 h-20 rotate-3' : 'right-32 top-10 w-16 h-16 -rotate-2'}`}>
            <img src={r.recipeImage} alt="" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute bottom-10 left-4 sm:left-8 lg:left-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-[11px] font-bold tracking-widest uppercase">Your Kitchen</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
            My <span className="text-emerald-400">Recipes</span>
          </h1>
          <p className="text-white/65 mt-2 text-sm max-w-sm">
            Your personal culinary collection. Create, edit and share your best dishes.
          </p>
        </div>

        {/* Stats pills */}
        <div className="absolute bottom-10 right-4 sm:right-8 hidden sm:flex gap-2">
          <div className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white font-bold text-base">{mealPlans.length}</span>
            <span className="text-white/70 text-xs ml-1.5">recipes</span>
          </div>
          <div className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white font-bold text-base">{filtered.length}</span>
            <span className="text-white/70 text-xs ml-1.5">showing</span>
          </div>
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Controls ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-7">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, cuisine or description…"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 shadow-sm transition-all font-medium placeholder-gray-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Create button */}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Create Recipe
          </motion.button>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl p-16 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#3a5d8f]/10 to-emerald-500/10 rounded-3xl flex items-center justify-center border border-white/50">
              <BookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? 'No recipes found' : 'No recipes yet'}
            </h2>
            <p className="text-gray-500 text-sm mb-7 max-w-xs mx-auto">
              {searchQuery
                ? `Nothing matched "${searchQuery}". Try a different search.`
                : 'Start building your culinary collection — create your first recipe!'}
            </p>
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')}
                className="text-[#3a5d8f] font-bold text-sm hover:underline">
                Clear search
              </button>
            ) : (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 text-sm mx-auto transition-all">
                <Plus className="w-4 h-4" /> Create First Recipe
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── Recipes grid ── */}
        {!isLoading && filtered.length > 0 && (
          <>
            {/* Result count */}
            <p className="text-sm font-semibold text-gray-400 mb-5">
              {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
              {searchQuery && <span> for "{searchQuery}"</span>}
            </p>

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((recipe, i) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    index={i}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <CreateRecipeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {editingRecipe && (
        <CreateRecipeModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setEditingRecipe(null); }}
          initialData={editingRecipe}
          isEditing={true}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default MyRecipes;