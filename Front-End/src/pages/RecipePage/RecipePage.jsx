import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserMealPlans } from '../../features/mealPlanning/mealPlanningSlice';
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

  const { mealPlans, isLoading, isError, message } = useSelector(
    (state) => state.mealPlanning
  );

  useEffect(() => {
    dispatch(getUserMealPlans())
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
  const filteredRecipes = mealPlans
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
      <div className="recipe-page">
        <Header />
        <div className="loading-spinner">Loading recipes...</div>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="recipe-page">
        <Header />
        <div className="error-message">
          <h3>Error loading recipes</h3>
          <p>{message}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="recipe-page">
      <Header />
      <div className="recipe-page-header">
        <div className="header-content">
          <h1>Discover Recipes</h1>
          <p>Explore our collection of delicious recipes from around the world</p>
        </div>
        
        <div className="search-filters">
          <div className="search-bar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <div className="dropdown">
              <button className="sort-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5h10"></path>
                  <path d="M11 9h7"></path>
                  <path d="M11 13h4"></path>
                  <path d="M3 17l3 3 3-3"></path>
                  <path d="M6 18V4"></path>
                </svg>
                Sort by: {sortBy}
              </button>
              <div className="dropdown-content">
                <button onClick={() => handleSortChange('rating')}>
                  Rating {sortBy === 'rating' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button onClick={() => handleSortChange('time')}>
                  Time {sortBy === 'time' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button onClick={() => handleSortChange('difficulty')}>
                  Difficulty {sortBy === 'difficulty' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="recipe-page-content">
        <div className="recipes-grid">
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
                description: recipe.description
              }} 
            />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="no-results">
            <h3>No recipes found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RecipePage; 