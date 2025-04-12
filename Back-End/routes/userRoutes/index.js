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

const userRouter = express.Router()

// Auth routes
userRouter.post('/register', uploadManager.fields([{ name: "profilePics", maxCount: 1 }]), registerController)
userRouter.post('/login', loginController)
userRouter.get('/verify-email', verifyEmailController)

// Meal Planning routes (protected by auth middleware)
userRouter.post('/meal-planning', verify,  uploadManager.fields([{ name: "recipeImage", maxCount: 1 }]), createMealPlanningController)
userRouter.get('/meal-planning', verify, getMealPlanningController)
userRouter.get('/meal-planning/:mealPlanId', verify, getMealPlanningByIdController)
userRouter.put('/meal-planning/:mealPlanId', verify, uploadManager.fields([{ name: "recipeImage", maxCount: 1 }]), updateMealPlanningController)
userRouter.delete('/meal-planning/:mealPlanId', verify, deleteMealPlanningController)

userRouter.get('/recipes', getAllRecipesController)
userRouter.get('/recipes/user', verify, getUserRecipesController)

export default userRouter