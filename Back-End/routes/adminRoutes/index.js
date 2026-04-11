import express from 'express'
import { registerAdminController, loginAdminController } from '../../controllers/Admin/authController.js'
import { getAllRecipes, deleteRecipe, changeAdminPassword } from '../../controllers/Admin/adminRecipesController.js';
import { 
  getAllUsersController, 
  getUserByIdController, 
  deleteUserController, 
  updateUserController,
  approveUserController
} from '../../controllers/Admin/userManagementController.js'
import { verify } from '../../middlewares/auth-middleware.js'
import { getAdminSurveyAnalytics } from '../../controllers/Users/surveyController.js';

const adminRouter = express.Router()

// Auth routes
adminRouter.post('/register', registerAdminController)
adminRouter.post('/login', loginAdminController)

// User management routes (protected by auth middleware)
adminRouter.get('/users', verify, getAllUsersController)
adminRouter.get('/users/:userId', verify, getUserByIdController)
adminRouter.delete('/users/:userId', verify, deleteUserController)
adminRouter.put('/users/:userId', verify, updateUserController)
adminRouter.patch('/users/:userId/approve', verify, approveUserController)


adminRouter.get('/recipes',                    getAllRecipes);
adminRouter.delete('/recipes/:recipeId',       deleteRecipe);
adminRouter.patch('/settings/change-password', changeAdminPassword);

// Survey analytics (admin only)
adminRouter.get('/survey/analytics', verify, getAdminSurveyAnalytics);

export default adminRouter
