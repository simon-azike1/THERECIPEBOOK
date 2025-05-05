import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMealPlanById } from '../../features/mealPlanning/mealPlanningSlice';
import { toast } from 'react-hot-toast';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './recipeView.css';

const RecipeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentMealPlan: recipe, isLoading } = useSelector((state) => state.mealPlanning);

  useEffect(() => {
    dispatch(getMealPlanById(id))
      .unwrap()
      .catch((error) => {
        toast.error(error || 'Failed to fetch recipe details');
        navigate('/my-recipes');
      });
  }, [dispatch, id, navigate]);

  if (isLoading) {
    return (
      <div className="recipe-view-page">
        <Header />
        <div className="loading-spinner">Loading recipe details...</div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-view-page">
        <Header />
        <div className="error-message">Recipe not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="recipe-view-page">
      <Header />
      <div className="recipe-view-container">
        <div className="recipe-header">
          <div className="recipe-image-container">
            <img src={recipe.recipeImage} alt={recipe.recipeName} className="recipe-image" />
            <div className="recipe-category">{recipe.cuisineType}</div>
          </div>

          <div className="recipe-info">
            <h1 className="recipe-title">{recipe.recipeName}</h1>
            
            <div className="recipe-meta">
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>Prep: {recipe.preparationTime} mins</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-fire"></i>
                <span>Cook: {recipe.cookingTime} mins</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-users"></i>
                <span>{recipe.servingSize} servings</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-signal"></i>
                <span>{recipe.difficultyLevel}</span>
              </div>
            </div>

            <p className="recipe-description">{recipe.description}</p>

            {recipe.dietaryRestrictions.length > 0 && (
              <div className="dietary-tags">
                {recipe.dietaryRestrictions.map(restriction => (
                  <span key={restriction} className="dietary-tag">
                    {restriction}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="recipe-content">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-quantity">{ingredient.quantity}</span>
                  <span className="ingredient-unit">{ingredient.unit}</span>
                  <span className="ingredient-name">{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <div className="instructions-content">
              {recipe.instructions.split('\n').map((step, index) => (
                <p key={index} className="instruction-step">
                  <span className="step-number">{index + 1}.</span>
                  {step}
                </p>
              ))}
            </div>
          </div>

          {recipe.tags.length > 0 && (
            <div className="tags-section">
              <h2>Tags</h2>
              <div className="tags-list">
                {recipe.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecipeView; 