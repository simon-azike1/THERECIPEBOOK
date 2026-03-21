import express from 'express'
import { loginController, registerController, verifyEmailController } from '../../controllers/Users/authControllers.js'
import { 
  createMealPlanningController,
  getMealPlanningController,
  getMealPlanningByIdController,
  updateMealPlanningController,
  deleteMealPlanningController,
  getAllRecipesController,
  getUserRecipesController
} from '../../controllers/Users/mealPlanningController.js'
import { uploadManager } from '../../modules/storage/cloudinary.js'
import { verify } from '../../middlewares/auth-middleware.js'
import {
  getWeeklyPlan,
  saveWeeklyPlan,
  clearDay,
  deleteWeeklyPlan,
} from '../../controllers/Users/weeklyPlanController.js'

const userRouter = express.Router()

// Auth routes
userRouter.post('/register', uploadManager.fields([{ name: "profilePics", maxCount: 1 }]), registerController)
userRouter.post('/login', loginController)
userRouter.get('/verify-email', verifyEmailController)

// Meal Planning routes (protected by auth middleware)
userRouter.post('/meal-planning', verify, uploadManager.fields([{ name: "recipeImage", maxCount: 1 }]), createMealPlanningController)
userRouter.get('/meal-planning', verify, getMealPlanningController)
userRouter.get('/meal-planning/:mealPlanId', verify, getMealPlanningByIdController)
userRouter.put('/meal-planning/:mealPlanId', verify, uploadManager.fields([{ name: "recipeImage", maxCount: 1 }]), updateMealPlanningController)
userRouter.delete('/meal-planning/:mealPlanId', verify, deleteMealPlanningController)

userRouter.get('/recipes', getAllRecipesController)
userRouter.get('/recipes/user', verify, getUserRecipesController)

// Weekly Plan routes (protected by auth middleware)
userRouter.get('/weekly-plan',            verify, getWeeklyPlan)
userRouter.post('/weekly-plan',           verify, saveWeeklyPlan)
userRouter.patch('/weekly-plan/clear-day', verify, clearDay)
userRouter.delete('/weekly-plan',         verify, deleteWeeklyPlan)
// At the top with other imports

import {
  getRecipeFeedback,
  submitFeedback,
  deleteFeedback,
} from '../../controllers/Users/feedbackController.js';

import {
  generateShoppingList,
  getShoppingList,
  toggleItem,
  deleteItem,
  addCustomItem,
  clearShoppingList,
} from '../../controllers/Users/shoppingListController.js';

// At the bottom before export default
userRouter.post('/shopping-list/generate', verify, generateShoppingList);
userRouter.get('/shopping-list',           verify, getShoppingList);
userRouter.patch('/shopping-list/toggle',  verify, toggleItem);
userRouter.post('/shopping-list/item',     verify, addCustomItem);
userRouter.delete('/shopping-list/item',   verify, deleteItem);
userRouter.delete('/shopping-list',        verify, clearShoppingList);
userRouter.get('/feedback/:recipeId',    getRecipeFeedback);
userRouter.post('/feedback/:recipeId',   verify, submitFeedback);
userRouter.delete('/feedback/:recipeId', verify, deleteFeedback);

export default userRouter