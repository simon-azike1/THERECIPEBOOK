import React from 'react';
import './hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-text-content">
          <h1 className="hero-title">
            Create & Share
            <span className="highlight">Your Recipes</span>
          </h1>
          <p className="hero-description">
            Join our culinary community where passion meets plate. Discover, create, 
            and share your favorite recipes with food enthusiasts worldwide.
          </p>
          <div className="hero-cta">
            <button className="cta-button primary">
              Start Cooking
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button className="cta-button secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              Watch Video
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">15k+</span>
              <span className="stat-label">Active Cooks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Recipes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-image-section">
          <div className="hero-image-container">
            <div className="hero-image"></div>
            <div className="floating-card card-1">
              <span className="emoji">🥗</span>
              <div className="card-content">
                <span className="card-title">Healthy Recipes</span>
                <span className="card-subtitle">1000+ Collections</span>
              </div>
            </div>
            <div className="floating-card card-2">
              <span className="emoji">📱</span>
              <div className="card-content">
                <span className="card-title">Easy Sharing</span>
                <span className="card-subtitle">Connect & Share</span>
              </div>
            </div>
            <div className="floating-card card-3">
              <span className="emoji">🛒</span>
              <div className="card-content">
                <span className="card-title">Shopping Lists</span>
                <span className="card-subtitle">Smart Planning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;