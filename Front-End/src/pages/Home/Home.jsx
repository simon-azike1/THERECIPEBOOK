import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import FeaturedRecipes from '../../components/FeaturedRecipes/FeaturedRecipes';
import CTASection from '../../components/CTASection/CTASection';
import Footer from '../../components/Footer/Footer';
import Newsletter from '../../components/Newsletter/Newsletter';
import Testimonials from '../../components/Testimonials/Testimonials';

const Home = () => {
  const { recipes } = useSelector((state) => state.recipes);

  // Get top rated recipes
  const topRatedRecipes = [...recipes]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Get latest recipes
  const latestRecipes = [...recipes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <Hero />
        <Features />
        <FeaturedRecipes 
          title="Top Rated Recipes"
          description="Discover our community's most loved recipes"
          recipes={topRatedRecipes}
        />
        
        <FeaturedRecipes 
          title="Latest Recipes"
          description="Fresh and new recipes from our community"
          recipes={latestRecipes}
        />
        
        <CTASection />
        <Newsletter />
        <Testimonials />
        <Footer />
    </div>
  );
};

export default Home;
