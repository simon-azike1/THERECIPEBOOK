import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMealPlan } from '../../features/mealPlanning/mealPlanningSlice';
import { toast } from 'react-hot-toast';
import './createRecipeModal.css';

const CreateRecipeModal = ({ 
  isOpen, 
  onClose, 
  initialData = null, 
  isEditing = false,
  onSave = null 
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.mealPlanning);

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

  const [previewImage, setPreviewImage] = useState(null);

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
    if (initialData) {
      setFormData({
        ...initialData,
        recipeImage: null // Reset image to null for new upload
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        recipeImage: file
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
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

      if (isEditing) {
        await onSave(formData);
      } else {
        await dispatch(createMealPlan(formData)).unwrap();
      }
      toast.success('Recipe created successfully!');
      onClose();
    } catch (error) {
      toast.error(error || `Failed to ${isEditing ? 'update' : 'create'} recipe`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Recipe' : 'Create New Recipe'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Basic Information Section */}
          <section className="form-section">
            <h3>Basic Information</h3>
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
            <h3>Time & Servings</h3>
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
                  placeholder="Please enter prep time"
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
                  placeholder="Please enter cook time"
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
                  placeholder="Please enter serving number"
                  required
                />
              </div>
            </div>
          </section>

          {/* Ingredients Section */}
          <section className="form-section">
            <h3>Ingredients*</h3>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <div className="ingredient-inputs">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeIngredient(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="add-btn" onClick={addIngredient}>
              <i className="fas fa-plus"></i> Add Ingredient
            </button>
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
            <div className="image-upload-container">
              <input
                type="file"
                id="recipeImage"
                name="recipeImage"
                onChange={handleImageChange}
                accept="image/*"
                required
                className="image-input"
              />
              {previewImage && (
                <div className="image-preview">
                  <img src={previewImage} alt="Recipe preview" />
                </div>
              )}
            </div>
          </section>

          {/* Additional Information */}
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
          </section>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Recipe'}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeModal; 