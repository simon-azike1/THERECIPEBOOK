import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserMealPlans } from '../../features/mealPlanning/mealPlanningSlice';
import { Link } from 'react-router-dom';
import RecipeCard from '../RecipeCard/RecipeCard';
import { toast } from 'react-hot-toast';
import './popularRecipes.css';

const PopularRecipes = () => {
  const dispatch = useDispatch();
  const { mealPlans, isLoading } = useSelector((state) => state.mealPlanning);

  useEffect(() => {
    dispatch(getUserMealPlans())
      .unwrap()
      .catch((error) => {
        toast.error(error || 'Failed to fetch recipes');
      });
  }, [dispatch]);

  // Get top 3 recipes by rating
  const popularRecipes = [...mealPlans]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <section className="popular-recipes">
      <div className="background-pattern"></div>
      <div className="popular-recipes-container">
        <div className="section-header">
          <div className="header-content">
            <span className="section-subtitle">Community Favorites</span>
            <h2>Popular Recipes</h2>
            <p>Discover our most loved recipes, crafted with passion and enjoyed by thousands in our community.</p>
          </div>

          <Link to="/recipes" className="view-all-link">
            <button className="view-all-btn">
              <span>Explore All Recipes</span>
              <div className="btn-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Discovering amazing recipes...</p>
          </div>
        ) : (
          <>
            <div className="recipes-grid">
              {popularRecipes.map((recipe, index) => (
                <div className="recipe-card-wrapper" key={recipe._id} style={{ animationDelay: `${index * 0.2}s` }}>
                  <RecipeCard
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
                    showBookmark={true}
                  />
                  <div className="recipe-number">#{index + 1}</div>
                </div>
              ))}
            </div>
            {popularRecipes.length === 0 && (
              <div className="no-recipes">
                <div className="no-recipes-icon">🍳</div>
                <h3>No Recipes Yet</h3>
                <p>Be the first to share your amazing recipe with our community!</p>
                <Link to="/my-recipes" className="create-recipe-btn">
                  Create Recipe
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PopularRecipes; 