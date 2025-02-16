import React from 'react';
import './popularRecipes.css';

const PopularRecipes = () => {
  const recipes = [
    {
      id: 1,
      title: "Mediterranean Salad",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80",
      category: "Healthy",
      time: "20 min",
      rating: 4.8,
      reviews: 234,
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
      }
    },
    {
      id: 2,
      title: "Classic Beef Burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80",
      category: "American",
      time: "30 min",
      rating: 4.9,
      reviews: 186,
      author: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
      }
    },
    {
      id: 3,
      title: "Vegetarian Pasta",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80",
      category: "Italian",
      time: "25 min",
      rating: 4.7,
      reviews: 158,
      author: {
        name: "Lisa Torres",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80"
      }
    }
  ];

  return (
    <section className="popular-recipes">
      <div className="popular-recipes-container">
        <div className="section-header">
          <div className="header-content">
            <h2>Popular Recipes</h2>
            <p>Discover our community's most loved recipes</p>
          </div>
          <button className="view-all-btn">
            View All Recipes
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-image">
                <img src={recipe.image} alt={recipe.title} />
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
                  <img src={recipe.author.avatar} alt={recipe.author.name} />
                  <span>By {recipe.author.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRecipes; 