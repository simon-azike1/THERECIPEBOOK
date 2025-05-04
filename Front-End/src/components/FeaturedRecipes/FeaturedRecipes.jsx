import React from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../RecipeCard/RecipeCard';

const FeaturedRecipes = ({ title, description, recipes }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
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
        <div className="text-center mt-12" >
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 px-6 py-3  text-white font-medium   rounded-full hover:bg-blue-700 transition-all"
            style={{background:"#3a5d8f"}}  >
            View All Recipes
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRecipes; 