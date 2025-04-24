import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './recipeCard.css';

const RecipeCard = ({ recipe, showBookmark = false }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const {
    id,
    title,
    image,
    category,
    time,
    rating,
    difficulty,
    servings,
    description
  } = recipe;

  const getDifficultyClass = (difficulty) => {
    const level = difficulty.toLowerCase();
    return `difficulty-${level}`;
  };

  return (
    <div className="recipe-card">
      <Link to={`/recipe/${id}`} className="recipe-link">
        <div className="recipe-image-container">
          <img src={image} alt={title} className="recipe-image" />
          <div className="recipe-overlay">
            <div className="recipe-category">{category}</div>
            {showBookmark && (
              <button 
                className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsBookmarked(!isBookmarked);
                }}
              >
                <i className={`fas ${isBookmarked ? 'fa-bookmark' : 'fa-bookmark-o'}`}></i>
              </button>
            )}
          </div>
        </div>
        
        <div className="recipe-info">
          <h3 className="recipe-title">{title}</h3>
          
          <div className="recipe-meta">
            <span className="recipe-time">
              <i className="fas fa-clock"></i> {time}
            </span>
            <span className="recipe-servings">
              <i className="fas fa-users"></i> {servings} servings
            </span>
            <span className={`recipe-difficulty ${getDifficultyClass(difficulty)}`}>
              {difficulty}
            </span>
          </div>

          <p className="recipe-description">{description}</p>

          <div className="recipe-footer">
            <div className="recipe-rating">
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`fas fa-star ${index < Math.floor(rating) ? 'filled' : ''}`}
                  ></i>
                ))}
              </div>
              <span className="rating-value">{rating.toFixed(1)}</span>
            </div>
            <span className="view-recipe">View Recipe <i className="fas fa-arrow-right"></i></span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard; 