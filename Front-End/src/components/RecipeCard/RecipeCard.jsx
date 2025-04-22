import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const {
    id,
    title,
    image,
    category,
    time,
    rating,
    difficulty,
    servings,
    description,
    author
  } = recipe;

  const getDifficultyClass = (difficulty) => {
    const level = difficulty?.toLowerCase();
    switch (level) {
      case 'easy':
        return 'bg-green-50 text-green-700';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700';
      case 'hard':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={`/recipe/${id}`} className="block text-inherit no-underline">
        <div className="relative w-full h-60 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <span className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-gray-800">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">
            {title}
          </h3>
          
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {time}
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {servings} servings
            </span>
            <span className={`px-3 py-1 rounded-xl text-sm font-medium ${getDifficultyClass(difficulty)}`}>
              {difficulty}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {renderStars(rating)}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {rating?.toFixed(1)}
              </span>
            </div>
            {author && (
              <span className="text-sm text-gray-600">
                by {author}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default RecipeCard; 