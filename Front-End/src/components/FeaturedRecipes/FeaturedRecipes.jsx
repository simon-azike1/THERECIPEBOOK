import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Star, ChefHat, Flame, Utensils } from 'lucide-react';

const DIFF_STYLE = {
  Easy:   'bg-emerald-100/90 text-emerald-700',
  Medium: 'bg-amber-100/90 text-amber-700',
  Hard:   'bg-red-100/90 text-red-700',
};

// Inline card — no dependency on external RecipeCard component
const RecipeCard = ({ recipe, index }) => {
  const totalTime = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/60 shadow-md hover:shadow-2xl hover:shadow-[#3a5d8f]/10 transition-all duration-300"
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
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-[#3a5d8f] transition-colors mb-1">
          {recipe.recipeName}
        </h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">{recipe.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />{totalTime} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-500" />{recipe.servingSize}
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">
            by {recipe.userId?.name || 'Anonymous'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedRecipes = ({ title, description, recipes = [] }) => {
  if (!recipes.length) return null;

  return (
    <section className="relative py-24 bg-gradient-to-br from-stone-50 via-blue-50/30 to-emerald-50/40 overflow-hidden">
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#3a5d8f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-black text-[#3a5d8f] uppercase tracking-widest mb-3">
              From the community
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              {title || 'Top Rated'}
              <span className="block bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">
                Recipes
              </span>
            </h2>
            {description && (
              <p className="text-gray-500 text-base mt-3 max-w-lg leading-relaxed">{description}</p>
            )}
          </div>

          {/* Browse button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-shrink-0 self-start md:self-auto mt-4 md:mt-0">
            <Link to="/recipes"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#3a5d8f] hover:bg-[#2c4a75] text-white font-bold rounded-xl text-sm shadow-md transition-all">
              Browse Recipes
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.slice(0, 6).map((recipe, i) => (
            <Link key={recipe._id} to={`/recipe/${recipe._id}`}>
              <RecipeCard recipe={recipe} index={i} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipes;