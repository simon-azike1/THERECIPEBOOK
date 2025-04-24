import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createMealPlan, reset } from '../../features/mealPlanning/mealPlanningSlice';
import './mealPlanning.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-hot-toast';

const MealPlanningForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.mealPlanning
  );

  const [formData, setFormData] = useState({
    recipeName: '',
    description: '',
    cuisineType: '',
    preparationTime: '',
    cookingTime: '',
    servingSize: '',
    difficultyLevel: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    instructions: '',
    tags: [],
    recipeImage: null,
    dietaryRestrictions: [],
    rating: 5
  });

  const cuisineTypes = [
    'Italian', 'Indian', 'Mexican', 'Chinese', 
    'Japanese', 'Thai', 'American', 'French', 
    'Mediterranean', 'Other'
  ];

  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  const dietaryOptions = [
    'Vegan', 'Vegetarian', 'Gluten-Free', 
    'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    if (!user?.isApproved) {
      navigate('/dashboard');
    }

    if (isError) {
      alert(message);
    }

    if (isSuccess) {
      dispatch(reset());
      navigate('/my-recipes');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      recipeImage: e.target.files[0]
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleDietaryChange = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.isApproved) {
      toast.error('Your account needs to be approved before creating recipes');
      return;
    }

    try {
      // Validate ingredients
      if (formData.ingredients.some(ing => !ing.name || !ing.quantity || !ing.unit)) {
        toast.error('Please fill in all ingredient fields');
        return;
      }

      // Validate required fields
      const requiredFields = [
        'recipeName', 'description', 'cuisineType', 'preparationTime',
        'cookingTime', 'servingSize', 'difficultyLevel', 'instructions'
      ];

      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(', ')}`);
        return;
      }

      // Validate image
      if (!formData.recipeImage) {
        toast.error('Please upload a recipe image');
        return;
      }

      const result = await dispatch(createMealPlan(formData)).unwrap();
      toast.success('Recipe created successfully!');
      navigate('/my-recipes');
    } catch (error) {
      toast.error(error || 'Failed to create recipe');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Add approval warning if user is not approved
  if (!user?.isApproved) {
    return (
      <div className="meal-planning-page">
        <Header />
        <div className="approval-warning">
          <h2>Account Pending Approval</h2>
          <p>Your account needs to be approved by an administrator before you can create recipes.</p>
          <p>Please check back later or contact support for more information.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="meal-planning-page">
      <Header />
      <div className="meal-planning-container">
        <div className="page-header">
          <h1>Create New Recipe</h1>
          <p>Share your culinary masterpiece with our community</p>
        </div>

        <form onSubmit={handleSubmit} className="meal-planning-form">
          {/* Basic Information Section */}
          <section className="form-section">
            <div className="section-header">
              <h2>Basic Information</h2>
              <p>Tell us about your recipe</p>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="recipeName">Recipe Name*</label>
                <input
                  type="text"
                  id="recipeName"
                  name="recipeName"
                  value={formData.recipeName}
                  onChange={handleInputChange}
                  placeholder="Enter recipe name"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your recipe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cuisineType">Cuisine Type*</label>
                <select
                  id="cuisineType"
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Cuisine</option>
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficultyLevel">Difficulty Level*</label>
                <select
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Difficulty</option>
                  {difficultyLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Time and Servings Section */}
          <section className="form-section">
            <div className="section-header">
              <h2>Time & Servings</h2>
              <p>Specify cooking details</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="preparationTime">Prep Time (mins)*</label>
                <input
                  type="number"
                  id="preparationTime"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cookingTime">Cook Time (mins)*</label>
                <input
                  type="number"
                  id="cookingTime"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="servingSize">Servings*</label>
                <input
                  type="number"
                  id="servingSize"
                  name="servingSize"
                  value={formData.servingSize}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="1"
                  required
                />
              </div>
            </div>
          </section>

          {/* Ingredients Section */}
          <section className="form-section">
            <h3>Ingredients</h3>
            
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    required
                  />
                </div>

              <div className="add-remove-btn">
              <button 
                  type="button" 
                  className="add-btn remove-btn"
                  onClick={() => removeIngredient(index)}
                >
                  Remove
                </button>
                <button 
              type="button" 
              className="add-btn"
              onClick={addIngredient}
            >
              Add Ingredient
            </button>

              </div>

              </div>
            ))}
            
           
          </section>

          {/* Instructions Section */}
          <section className="form-section">
            <h3>Instructions*</h3>
            <div className="form-group">
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                required
                rows="6"
                placeholder="Enter step-by-step instructions..."
              />
            </div>
          </section>

          {/* Image Upload Section */}
          <section className="form-section">
            <h3>Recipe Image*</h3>
            <div className="form-group">
              <input
                type="file"
                id="recipeImage"
                name="recipeImage"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </div>
            {formData.recipeImage && (
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(formData.recipeImage)} 
                  alt="Recipe preview" 
                />
              </div>
            )}
          </section>

          {/* Tags and Dietary Restrictions Section */}
          <section className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="e.g., healthy, quick, vegetarian"
              />
            </div>

            <div className="form-group">
              <label>Dietary Restrictions</label>
              <div className="dietary-options">
                {dietaryOptions.map(restriction => (
                  <label key={restriction} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.dietaryRestrictions.includes(restriction)}
                      onChange={() => handleDietaryChange(restriction)}
                    />
                    {restriction}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
              />
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Create Recipe
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button type="button" className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default MealPlanningForm;