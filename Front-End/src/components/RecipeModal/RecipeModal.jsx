import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRecipeSearch } from '../../hooks/useRecipeSearch';
import './RecipeModal.css';

const RecipeModal = ({ isOpen, onClose, selectedMeal, onSave }) => {
  const [modalTab, setModalTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [previewRecipe, setPreviewRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    time: '',
    calories: '',
    image: null,
    ingredients: [''],
    instructions: [''],
    nutrition: {
      protein: '',
      carbs: '',
      fat: '',
      fiber: ''
    }
  });

  const { results, loading, error } = useRecipeSearch(searchQuery);

  const dietaryFilters = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
    { id: 'keto', label: 'Keto', icon: '🥑' }
  ];

  const filteredResults = results.filter(recipe => {
    if (selectedFilters.length === 0) return true;
    return selectedFilters.every(filter => recipe.dietary.includes(filter));
  });

  const handleFilterToggle = (filterId) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handlePreview = (recipe) => {
    setPreviewRecipe(recipe);
  };

  const renderPreviewModal = () => {
    if (!previewRecipe) return null;

    return (
      <div className="preview-modal">
        <div className="preview-content">
          <button className="close-preview" onClick={() => setPreviewRecipe(null)}>×</button>
          <img src={previewRecipe.image} alt={previewRecipe.title} />
          <h2>{previewRecipe.title}</h2>
          <div className="recipe-details">
            <span>⏱️ {previewRecipe.time}</span>
            <span>🔥 {previewRecipe.calories} cal</span>
          </div>
          <div className="recipe-ingredients">
            <h3>Ingredients</h3>
            <ul>
              {previewRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div className="recipe-instructions">
            <h3>Instructions</h3>
            <ol>
              {previewRecipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          <button className="add-recipe-btn" onClick={() => {
            onSave(previewRecipe);
            setPreviewRecipe(null);
            onClose();
          }}>
            Add to Meal Plan
          </button>
        </div>
      </div>
    );
  };

  // Drag and drop implementation
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRecipe(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  // Image upload area with drag & drop
  const renderImageUploadArea = () => (
    <div className="form-group">
      <label>Recipe Image</label>
      <div 
        {...getRootProps()} 
        className={`image-upload-area ${isDragActive ? 'dragging' : ''}`}
      >
        <input {...getInputProps()} />
        {newRecipe.image ? (
          <div className="image-preview">
            <img src={newRecipe.image} alt="Recipe preview" />
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                setNewRecipe({...newRecipe, image: null});
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <span>📸</span>
            <span>
              {isDragActive 
                ? 'Drop the image here...' 
                : 'Drag & drop an image or click to select'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients[index] = value;
    setNewRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...newRecipe.instructions];
    newInstructions[index] = value;
    setNewRecipe(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!newRecipe.title.trim()) errors.title = 'Title is required';
    if (!newRecipe.time.trim()) errors.time = 'Preparation time is required';
    if (!newRecipe.calories) errors.calories = 'Calories are required';
    if (newRecipe.ingredients.some(i => !i.trim())) {
      errors.ingredients = 'All ingredients must be filled';
    }
    if (newRecipe.instructions.some(i => !i.trim())) {
      errors.instructions = 'All instructions must be filled';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      onSave(newRecipe);
      onClose();
    } else {
      setFormErrors(errors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="recipe-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Meal for {selectedMeal?.day} - {selectedMeal?.type}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="modal-tabs">
            <button 
              className={`modal-tab ${modalTab === 'search' ? 'active' : ''}`}
              onClick={() => setModalTab('search')}
            >
              Search Recipes
            </button>
            <button 
              className={`modal-tab ${modalTab === 'create' ? 'active' : ''}`}
              onClick={() => setModalTab('create')}
            >
              Create New
            </button>
          </div>

          {modalTab === 'search' ? (
            <div className="recipe-search-section">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn">
                  <span>🔍</span>
                </button>
              </div>
              <div className="dietary-filters">
                {dietaryFilters.map(filter => (
                  <button
                    key={filter.id}
                    className={`filter-btn ${selectedFilters.includes(filter.id) ? 'active' : ''}`}
                    onClick={() => handleFilterToggle(filter.id)}
                  >
                    <span>{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="recipe-grid">
                {filteredResults.map(recipe => (
                  <div
                    key={recipe.id}
                    className="recipe-card"
                    onClick={() => handlePreview(recipe)}
                  >
                    {/* ... recipe card content ... */}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="create-recipe-section">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Recipe Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter recipe name"
                    value={newRecipe.title}
                    onChange={(e) => setNewRecipe({...newRecipe, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preparation Time</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 30 mins"
                      value={newRecipe.time}
                      onChange={(e) => setNewRecipe({...newRecipe, time: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Calories</label>
                    <input 
                      type="number" 
                      placeholder="e.g., 500"
                      value={newRecipe.calories}
                      onChange={(e) => setNewRecipe({...newRecipe, calories: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {renderImageUploadArea()}

                <div className="form-group">
                  <label>Ingredients</label>
                  <div className="ingredients-list">
                    {newRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="ingredient-item">
                        <input 
                          type="text"
                          value={ingredient}
                          onChange={(e) => handleIngredientChange(index, e.target.value)}
                          placeholder="Enter ingredient"
                          required
                        />
                        {newRecipe.ingredients.length > 1 && (
                          <button type="button" onClick={() => removeIngredient(index)}>×</button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="add-ingredient-btn"
                      onClick={addIngredient}
                    >
                      + Add Ingredient
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Instructions</label>
                  <div className="instructions-list">
                    {newRecipe.instructions.map((step, index) => (
                      <div key={index} className="instruction-step">
                        <span className="step-number">{index + 1}</span>
                        <textarea
                          value={step}
                          onChange={(e) => handleInstructionChange(index, e.target.value)}
                          placeholder="Enter instruction step"
                          required
                        />
                        {newRecipe.instructions.length > 1 && (
                          <button type="button" onClick={() => removeInstruction(index)}>×</button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="add-instruction-btn"
                      onClick={addInstruction}
                    >
                      + Add Step
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Nutrition Information</label>
                  <div className="nutrition-grid">
                    {Object.entries(newRecipe.nutrition).map(([key, value]) => (
                      <div key={key} className="nutrition-input">
                        <label>{key.charAt(0).toUpperCase() + key.slice(1)} (g)</label>
                        <input 
                          type="number"
                          value={value}
                          onChange={(e) => setNewRecipe({
                            ...newRecipe,
                            nutrition: {
                              ...newRecipe.nutrition,
                              [key]: e.target.value
                            }
                          })}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Recipe
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Preview modal */}
        {renderPreviewModal()}
      </div>
    </div>
  );
};

export default RecipeModal; 