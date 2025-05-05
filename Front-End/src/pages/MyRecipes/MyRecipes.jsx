import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserMealPlans, deleteMealPlan, updateMealPlan } from '../../features/mealPlanning/mealPlanningSlice';
import './myRecipes.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-hot-toast';
import CreateRecipeModal from '../../components/CreateRecipeModal/CreateRecipeModal';

const MyRecipes = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state) => state.auth);
  const { mealPlans, isLoading, isError, message } = useSelector(
    (state) => state.mealPlanning
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    dispatch(getUserMealPlans())
      .unwrap()
      .catch((error) => {
        toast.error(error || 'Failed to fetch your recipes');
      });
  }, [dispatch]);

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await dispatch(deleteMealPlan(recipeId)).unwrap();
        toast.success('Recipe deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete recipe');
      }
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setIsEditModalOpen(true);
  };

  const handleUpdateRecipe = async (updatedData) => {
    try {
      await dispatch(updateMealPlan({ 
        id: editingRecipe._id, 
        updateData: updatedData 
      })).unwrap();
      toast.success('Recipe updated successfully');
      setIsEditModalOpen(false);
      setEditingRecipe(null);
    } catch (error) {
      toast.error(error || 'Failed to update recipe');
    }
  };

  const filteredRecipes = mealPlans.filter(recipe => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        recipe.recipeName.toLowerCase().includes(query) ||
        recipe.cuisineType.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRecipe(null);
  };

  if (isLoading) {
    return (
      <div className="my-recipes-page">
        <Header />
        <div className="loading-spinner">Loading your recipes...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-recipes-page">
      <Header />
      <div className="my-recipes-container">
        <div className="my-recipes-header">
          <div className="header-content">
            <h1>Recipes</h1>
            <p>Manage and organize your personal recipe collection</p>
          </div>

          <div className="header-actions">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search your recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </div>

            <button onClick={openCreateModal} className="create-recipe-btn">
              <i className="fas fa-plus"></i>
              Create New Recipe
            </button>
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="no-recipes">
            <div className="no-recipes-content">
              <i className="fas fa-book-open"></i>
              <h2>No Recipes Yet</h2>
              <p>Start building your collection by creating your first recipe!</p>
              <button onClick={openCreateModal} className="create-first-recipe-btn">
                Create Your First Recipe
              </button>
            </div>
          </div>
        ) : (
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                <div className="recipe-image-container">
                  <img src={recipe.recipeImage} alt={recipe.recipeName} className="recipe-image" />
                  <div className="recipe-category">{recipe.cuisineType}</div>
                </div>

                <div className="recipe-info">
                  <h3 className="recipe-title">{recipe.recipeName}</h3>
                  
                  <div className="recipe-meta">
                    <span className="recipe-time">
                      <i className="fas fa-clock"></i>
                      {recipe.preparationTime + recipe.cookingTime} min
                    </span>
                    <span className="recipe-difficulty">
                      {recipe.difficultyLevel}
                    </span>
                  </div>

                  <p className="recipe-description">{recipe.description}</p>

                  <div className="recipe-actions">
                    <button
                      onClick={() => handleEditRecipe(recipe)}
                      className="edit-btn"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe._id)}
                      className="delete-btn"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                    <Link to={`/recipe/${recipe._id}`} className="view-btn">
                      <i className="fas fa-eye"></i> View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Recipe Modal */}
        <CreateRecipeModal 
          isOpen={isCreateModalOpen} 
          onClose={closeCreateModal} 
        />

        {/* Edit Recipe Modal */}
        {editingRecipe && (
          <CreateRecipeModal 
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            initialData={editingRecipe}
            isEditing={true}
            onSave={handleUpdateRecipe}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyRecipes; 