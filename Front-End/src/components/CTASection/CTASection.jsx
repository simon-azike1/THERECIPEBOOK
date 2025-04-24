import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Share Your Recipe?</h2>
        <p className="text-lg text-blue-100 mb-8">
          Join our community and share your culinary creations with food lovers worldwide.
        </p>
        <Link
          to="/my-recipes/create"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-all transform hover:scale-105"
        >
          Create Recipe
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default CTASection; 