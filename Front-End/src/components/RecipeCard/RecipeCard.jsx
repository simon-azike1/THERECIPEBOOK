import React from 'react';
import './recipeCard.css';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <div className="recipe-image">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          loading="lazy" // Enable lazy loading for images
        />
        <div className="recipe-category">{recipe.category}</div>
        <button className="bookmark-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
      <div className="recipe-content">
        <div className="recipe-info">
          <span className="time">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {recipe.time}
          </span>
          <span className="rating">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {recipe.rating} ({recipe.reviews})
          </span>
        </div>
        <h3>{recipe.title}</h3>
        <div className="recipe-author">
          <img 
            src={recipe.author.avatar} 
            alt={recipe.author.name}
            loading="lazy"
          />
          <span>By {recipe.author.name}</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RecipeCard); 