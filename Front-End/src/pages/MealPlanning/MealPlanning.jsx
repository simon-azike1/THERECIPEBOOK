import React, { useState } from 'react';
import RecipeModal from '../../components/RecipeModal/RecipeModal';
import './mealPlanning.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const MealPlanning = () => {
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Initialize the weekly plan with all days and meal types
  const initialWeeklyPlan = daysOfWeek.reduce((acc, day) => {
    acc[day] = mealTypes.reduce((meals, type) => {
      meals[type] = null;
      return meals;
    }, {});
    return acc;
  }, {});

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('weekly');
  const [editMode, setEditMode] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState(initialWeeklyPlan);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dietaryPreferences = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
    { id: 'keto', label: 'Keto', icon: '🥑' },
    { id: 'paleo', label: 'Paleo', icon: '🍖' }
  ];

  const [preferences, setPreferences] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 70,
    dietary: []
  });

  const handleMealSelect = (recipe) => {
    if (selectedMeal) {
      const { day, type } = selectedMeal;
      setWeeklyPlan(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [type]: recipe
        }
      }));
      setSelectedMeal(null);
      setEditMode(false);
    }
  };

  const nutritionSummary = {
    calories: 1550,
    protein: 89,
    carbs: 145,
    fat: 63
  };

  const groceryList = [
    { category: 'Produce', items: ['Spinach', 'Berries', 'Avocado', 'Sweet Potato'] },
    { category: 'Protein', items: ['Chicken Breast', 'Salmon', 'Eggs', 'Greek Yogurt'] },
    { category: 'Grains', items: ['Quinoa', 'Oatmeal', 'Brown Rice', 'Whole Wheat Bread'] },
    { category: 'Other', items: ['Olive Oil', 'Mixed Nuts', 'Honey', 'Chia Seeds'] }
  ];

  // Sample recipe data for testing
  const sampleRecipe = {
    title: "Sample Meal",
    calories: 500,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80",
    time: "30 min"
  };

  const [modalTab, setModalTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    time: '',
    calories: '',
    image: null,
    ingredients: [],
    instructions: []
  });

  const handleCreateRecipe = (e) => {
    e.preventDefault();
    // Handle recipe creation
  };

  const handleImageUpload = (e) => {
    // Handle image upload
  };

  const handleIngredientChange = (index, value) => {
    // Handle ingredient change
  };

  const removeIngredient = (index) => {
    // Handle removing an ingredient
  };

  const addIngredient = () => {
    // Handle adding a new ingredient
  };

  const handleInstructionChange = (index, value) => {
    // Handle instruction change
  };

  const removeInstruction = (index) => {
    // Handle removing an instruction
  };

  const addInstruction = () => {
    // Handle adding a new instruction
  };

  const handleMealClick = (day, type) => {
    setSelectedMeal({ day, type });
    setIsModalOpen(true);
  };

  const handleSaveRecipe = (recipe) => {
    if (selectedMeal) {
      setWeeklyPlan(prev => ({
        ...prev,
        [selectedMeal.day]: {
          ...prev[selectedMeal.day],
          [selectedMeal.type]: recipe
        }
      }));
    }
  };

  return (
    <div className="meal-planning-page">
      <Header />
      <div className="meal-planning-header">
        <h1>Meal Planning</h1>
        <p>Create your perfect weekly meal plan</p>
        <div className="planning-tabs">
          <button 
            className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly Plan
          </button>
          <button 
            className={`tab-btn ${activeTab === 'grocery' ? 'active' : ''}`}
            onClick={() => setActiveTab('grocery')}
          >
            Grocery List
          </button>
        </div>
      </div>

      <div className="meal-planning-container">
        {/* Preferences Section */}
        <div className="preferences-section">
          <h2>Your Preferences</h2>
          <div className="nutrition-goals">
            <h3>Daily Nutrition Goals</h3>
            <div className="nutrition-inputs">
              <div className="input-group">
                <label>Calories</label>
                <input 
                  type="number" 
                  value={preferences.calories}
                  onChange={(e) => setPreferences(prev => ({...prev, calories: e.target.value}))}
                />
              </div>
              <div className="input-group">
                <label>Protein (g)</label>
                <input 
                  type="number" 
                  value={preferences.protein}
                  onChange={(e) => setPreferences(prev => ({...prev, protein: e.target.value}))}
                />
              </div>
              <div className="input-group">
                <label>Carbs (g)</label>
                <input 
                  type="number" 
                  value={preferences.carbs}
                  onChange={(e) => setPreferences(prev => ({...prev, carbs: e.target.value}))}
                />
              </div>
              <div className="input-group">
                <label>Fat (g)</label>
                <input 
                  type="number" 
                  value={preferences.fat}
                  onChange={(e) => setPreferences(prev => ({...prev, fat: e.target.value}))}
                />
              </div>
            </div>
          </div>

          <div className="dietary-preferences">
            <h3>Dietary Preferences</h3>
            <div className="preference-options">
              {dietaryPreferences.map(pref => (
                <label key={pref.id} className="preference-checkbox">
                  <input 
                    type="checkbox"
                    checked={preferences.dietary.includes(pref.id)}
                    onChange={(e) => {
                      const newPreferences = e.target.checked 
                        ? [...preferences.dietary, pref.id]
                        : preferences.dietary.filter(p => p !== pref.id);
                      setPreferences(prev => ({...prev, dietary: newPreferences}));
                    }}
                  />
                  <span className="checkbox-icon">{pref.icon}</span>
                  {pref.label}
                </label>
              ))}
            </div>
          </div>

          <div className="nutrition-summary">
            <h3>Today's Summary</h3>
            <div className="nutrition-progress">
              <div className="progress-item">
                <div className="progress-label">
                  <span>Calories</span>
                  <span>{nutritionSummary.calories} / {preferences.calories}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(nutritionSummary.calories / preferences.calories) * 100}%` }}
                  ></div>
                </div>
              </div>
              {/* Similar progress bars for protein, carbs, fat */}
            </div>
          </div>
        </div>

        {activeTab === 'weekly' ? (
          <div className="weekly-planner">
            <div className="planner-controls">
              <div className="date-navigation">
                <button className="nav-btn">
                  <span>←</span>
                </button>
                <h3>Week of {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
                <button className="nav-btn">
                  <span>→</span>
                </button>
              </div>
              <div className="action-buttons">
                <button className="generate-btn">Generate Plan</button>
                <button className="save-btn">Save Plan</button>
                <button className="share-btn">Share Plan</button>
              </div>
            </div>

            <div className="meal-grid">
              <div className="time-slots">
                <div className="slot-header"></div>
                {mealTypes.map(type => (
                  <div key={type} className="meal-type-label">
                    <span>{type}</span>
                  </div>
                ))}
              </div>

              {daysOfWeek.map(day => (
                <div key={day} className="day-column">
                  <div className="day-header">{day}</div>
                  {mealTypes.map(type => (
                    <div 
                      key={`${day}-${type}`} 
                      className="meal-slot"
                      onClick={() => handleMealClick(day, type)}
                    >
                      {weeklyPlan[day][type] ? (
                        <div className="planned-meal">
                          <img src={weeklyPlan[day][type].image} alt={weeklyPlan[day][type].title} />
                          <div className="meal-info">
                            <h4>{weeklyPlan[day][type].title}</h4>
                            <span>{weeklyPlan[day][type].calories} cal</span>
                          </div>
                        </div>
                      ) : (
                        <div className="empty-slot">
                          <span>+ Add {type}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grocery-list-section">
            <div className="grocery-header">
              <h2>Grocery List</h2>
              <div className="grocery-actions">
                <button className="print-btn">
                  <span>🖨️</span> Print List
                </button>
                <button className="share-btn">
                  <span>📤</span> Share List
                </button>
              </div>
            </div>

            <div className="grocery-categories">
              {groceryList.map((category, index) => (
                <div key={index} className="category-section">
                  <h3>{category.category}</h3>
                  <ul className="grocery-items">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <label className="checkbox-label">
                          <input type="checkbox" />
                          <span className="checkbox-custom"></span>
                          {item}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedMeal={selectedMeal}
        onSave={handleSaveRecipe}
      />
      <Footer />
    </div>
  );
};

export default MealPlanning; 