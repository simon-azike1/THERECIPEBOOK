import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './hero.css';

const Hero = () => {
  // Initial stats data
  const statsData = [
    { number: 15000, label: 'Active Cooks' },
    { number: 50000, label: 'Recipes' },
    { number: 4.9, label: 'User Rating' }
  ];

  // State for animated counters
  const [counters, setCounters] = useState(statsData.map(() => 0));

  useEffect(() => {
    const durations = [2000, 2000, 1500]; // Duration for each counter animation
    const intervalIds = statsData.map((stat, index) => {
      let start = 0;
      const increment = Math.ceil(stat.number / (durations[index] / 30)); // Increment per frame
      return setInterval(() => {
        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = Math.min(newCounters[index] + increment, stat.number);
          return newCounters;
        });
      }, 30);
    });

    // Cleanup intervals
    return () => intervalIds.forEach(id => clearInterval(id));
  }, []);

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
            <Link to="/Register" className="LINK">
              <button className="cta-button primary">
                Start Cooking
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </Link>

            <Link to="./RecipeVideo" className='LINK'>
            <button className="cta-button secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              Watch Video
            </button>
            </Link>
            
          </div>

          {/* Stats Section */}
          <div className="hero-stats">
            {statsData.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-number">
                  {stat.label === 'User Rating' ? counters[index].toFixed(1) : `${counters[index]}+`}
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image Section */}
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
