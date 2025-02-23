import React, { useState, useMemo } from 'react';
import './recipePage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RecipeCard from '../../components/RecipeCard/RecipeCard';

const RecipePage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'time', 'reviews'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  const recipes = [
    {
      id: 1,
      title: "Mediterranean Salad",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      category: "Healthy",
      time: "20 min",
      rating: 4.8,
      reviews: 234,
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
      }
    },
    {
      id: 2,
      title: "Classic Beef Burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      category: "American",
      time: "30 min",
      rating: 4.9,
      reviews: 186,
      author: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      }
    },
    {
      id: 3,
      title: "Vegetarian Pasta",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
      category: "Italian",
      time: "25 min",
      rating: 4.7,
      reviews: 158,
      author: {
        name: "Lisa Torres",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      }
    },
    {
      id: 4,
      title: "Chicken Tikka Masala",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db",
      category: "Indian",
      time: "45 min",
      rating: 4.9,
      reviews: 312,
      author: {
        name: "Raj Patel",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
      }
    },
    {
      id: 5,
      title: "Chocolate Lava Cake",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51",
      category: "Desserts",
      time: "35 min",
      rating: 4.8,
      reviews: 175,
      author: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
      }
    },
    {
      id: 6,
      title: "Sushi Roll Platter",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      category: "Japanese",
      time: "50 min",
      rating: 4.9,
      reviews: 267,
      author: {
        name: "Yuki Tanaka",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
      }
    },
    {
      id: 7,
      title: "Greek Salad Bowl",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
      category: "Healthy",
      time: "15 min",
      rating: 4.6,
      reviews: 142,
      author: {
        name: "Maria Costa",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      }
    },
    {
      id: 8,
      title: "BBQ Pulled Pork",
      image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc",
      category: "American",
      time: "4 hrs",
      rating: 4.9,
      reviews: 198,
      author: {
        name: "John Smith",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61"
      }
    },
    {
      id: 9,
      title: "Avocado Toast",
      image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2",
      category: "Breakfast",
      time: "10 min",
      rating: 4.5,
      reviews: 156,
      author: {
        name: "Sophie Chen",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
      }
    },
    {
      id: 10,
      title: "Margherita Pizza",
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca",
      category: "Italian",
      time: "40 min",
      rating: 4.8,
      reviews: 289,
      author: {
        name: "Marco Rossi",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
      }
    },
    {
      id: 11,
      title: "Thai Green Curry",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
      category: "Thai",
      time: "35 min",
      rating: 4.7,
      reviews: 167,
      author: {
        name: "Suki Lee",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
      }
    },
    {
      id: 12,
      title: "Blueberry Pancakes",
      image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
      category: "Breakfast",
      time: "25 min",
      rating: 4.6,
      reviews: 145,
      author: {
        name: "Emily Brown",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e"
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Recipes' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'american', name: 'American' },
    { id: 'italian', name: 'Italian' },
    { id: 'indian', name: 'Indian' },
    { id: 'japanese', name: 'Japanese' },
    { id: 'thai', name: 'Thai' },
    { id: 'healthy', name: 'Healthy' },
    { id: 'desserts', name: 'Desserts' }
  ];

  // Filter and sort recipes
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter(recipe => {
        // Category filter
        if (activeTab !== 'all' && recipe.category.toLowerCase() !== activeTab) {
          return false;
        }

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            recipe.title.toLowerCase().includes(query) ||
            recipe.category.toLowerCase().includes(query) ||
            recipe.author.name.toLowerCase().includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => {
        // Sort logic
        if (sortBy === 'rating') {
          return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
        }
        if (sortBy === 'reviews') {
          return sortOrder === 'desc' ? b.reviews - a.reviews : a.reviews - b.reviews;
        }
        if (sortBy === 'time') {
          const timeA = parseInt(a.time);
          const timeB = parseInt(b.time);
          return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
        }
        return 0;
      });
  }, [recipes, activeTab, searchQuery, sortBy, sortOrder]);

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if clicking the same sort option
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <div className="recipe-page">
      <Header />
      <div className="recipe-page-header">
        <div className="header-content">
          <h1>Discover Recipes</h1>
          <p>Explore our collection of delicious recipes from around the world</p>
        </div>
        
        <div className="search-filters">
          <div className="search-bar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <div className="dropdown">
              <button className="sort-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5h10"></path>
                  <path d="M11 9h7"></path>
                  <path d="M11 13h4"></path>
                  <path d="M3 17l3 3 3-3"></path>
                  <path d="M6 18V4"></path>
                </svg>
                Sort by: {sortBy}
              </button>
              <div className="dropdown-content">
                <button onClick={() => handleSortChange('rating')}>
                  Rating {sortBy === 'rating' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button onClick={() => handleSortChange('reviews')}>
                  Reviews {sortBy === 'reviews' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
                <button onClick={() => handleSortChange('time')}>
                  Time {sortBy === 'time' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="recipe-page-content">
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="no-results">
            <h3>No recipes found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RecipePage; 