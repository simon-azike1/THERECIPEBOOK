import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRecipes } from '../../features/recipes/recipesSlice';
import './recipePage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { toast } from 'react-hot-toast';

const RecipePage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');

  const { recipes, isLoading, isError, message } = useSelector(
    (state) => state.recipes
  );

  useEffect(() => {
    dispatch(getAllRecipes())
      .unwrap()
      .catch((error) => {
        toast.error(error || 'Failed to fetch recipes');
      });
  }, [dispatch]);

  const categories = [
    { id: 'all', name: 'All Recipes' },
    { id: 'Italian', name: 'Italian' },
    { id: 'Indian', name: 'Indian' },
    { id: 'Mexican', name: 'Mexican' },
    { id: 'Chinese', name: 'Chinese' },
    { id: 'Japanese', name: 'Japanese' },
    { id: 'Thai', name: 'Thai' },
    { id: 'American', name: 'American' },
    { id: 'French', name: 'French' },
    { id: 'Mediterranean', name: 'Mediterranean' },
    { id: 'Other', name: 'Other' }
  ];

  // Filter and sort recipes
  const filteredRecipes = recipes
    .filter(recipe => {
      // Category filter
      if (activeTab !== 'all' && recipe.cuisineType !== activeTab) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          recipe.recipeName.toLowerCase().includes(query) ||
          recipe.cuisineType.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === 'rating') {
        return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      }
      if (sortBy === 'time') {
        return sortOrder === 'desc' 
          ? (b.preparationTime + b.cookingTime) - (a.preparationTime + a.cookingTime) 
          : (a.preparationTime + a.cookingTime) - (b.preparationTime + b.cookingTime);
      }
      if (sortBy === 'difficulty') {
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return sortOrder === 'desc'
          ? difficultyOrder[b.difficultyLevel] - difficultyOrder[a.difficultyLevel]
          : difficultyOrder[a.difficultyLevel] - difficultyOrder[b.difficultyLevel];
      }
      return 0;
    });

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center min-h-[400px] text-xl text-blue-600">
          Loading recipes...
        </div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-16 bg-white rounded-2xl max-w-2xl mx-auto my-8">
          <h3 className="text-2xl font-bold text-red-600 mb-2">Error loading recipes</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pt-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Discover Recipes</h1>
          <p className="text-lg text-gray-600">
            Explore our collection of delicious recipes from around the world
          </p>
        </div>
        
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="flex-1 relative min-w-[280px]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-600 focus:ring focus:ring-blue-600/10 focus:outline-none"
            />
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-medium min-w-[140px] hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M11 5h10"></path>
                <path d="M11 9h7"></path>
                <path d="M11 13h4"></path>
                <path d="M3 17l3 3 3-3"></path>
                <path d="M6 18V4"></path>
              </svg>
              Sort by: {sortBy}
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg p-2 min-w-[160px] z-10">
              <button 
                onClick={() => handleSortChange('rating')}
                className="block w-full px-4 py-2 text-left text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
              >
                Rating {sortBy === 'rating' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                onClick={() => handleSortChange('time')}
                className="block w-full px-4 py-2 text-left text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
              >
                Time {sortBy === 'time' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button 
                onClick={() => handleSortChange('difficulty')}
                className="block w-full px-4 py-2 text-left text-gray-700 text-sm rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
              >
                Difficulty {sortBy === 'difficulty' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-300 
                ${activeTab === category.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe._id} 
              recipe={{
                id: recipe._id,
                title: recipe.recipeName,
                image: recipe.recipeImage,
                category: recipe.cuisineType,
                time: `${recipe.preparationTime + recipe.cookingTime} min`,
                rating: recipe.rating,
                difficulty: recipe.difficultyLevel,
                servings: recipe.servingSize,
                description: recipe.description,
                author: recipe.userId?.name || 'Anonymous'
              }} 
            />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RecipePage; 