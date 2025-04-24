import React, { useState } from 'react';
import './testimonials.css';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Emily Chen",
      role: "Home Chef",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
      content: "TheRecipeBook has transformed how I organize my recipes. The meal planning feature saves me so much time every week!",
      rating: 5
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Food Enthusiast",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      content: "I've discovered amazing recipes from around the world. The community here is incredibly supportive and inspiring.",
      rating: 5
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "Food Blogger",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      content: "As a food blogger, I love how easy it is to share my recipes. The platform is intuitive and the features are exactly what I need.",
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of satisfied home chefs and food enthusiasts</p>
        </div>

        <div className="testimonials-slider">
          <div className="slider-controls">
            <button 
              className="control-btn prev" 
              onClick={prevSlide}
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button 
              className="control-btn next" 
              onClick={nextSlide}
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="testimonials-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="quote-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity="0.1">
                    <path d="M3.691 6.292C5.094 4.771 7.217 4 10.061 4h.178v2.136c-2.258.061-3.668.926-4.23 2.593-.115.34-.172.601-.172.783h4.402V17H3.82V9.342c0-1.033.197-2.056.592-3.07zm10 0C15.094 4.771 17.217 4 20.061 4h.178v2.136c-2.258.061-3.668.926-4.23 2.593-.115.34-.172.601-.172.783h4.402V17h-6.419V9.342c0-1.033.197-2.056.592-3.07z"/>
                  </svg>
                </div>
                
                <div className="testimonial-content">
                  <p>{testimonial.content}</p>
                  
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <svg key={index} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    ))}
                  </div>
                </div>

                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="slider-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 