import express from 'express'
import { loginController, registerController, verifyEmailController } from '../../controllers/Users/authControllers.js'
import { 
  createMealPlanningController,
  getMealPlanningController,
  getMealPlanningByIdController,
  updateMealPlanningController,
  deleteMealPlanningController
} from '../../controllers/Users/mealPlanningController.js'
import { upload } from '../../utils/index.js'
import { verify } from '../../middlewares/auth-middleware.js'

const userRouter = express.Router()

// Auth routes
userRouter.post('/register', upload.single('profilePics'), registerController)
userRouter.post('/login', loginController)
userRouter.get('/verify-email', verifyEmailController)

// Meal Planning routes (protected by auth middleware)
userRouter.post('/meal-planning', verify, upload.single('recipeImage'), createMealPlanningController)
userRouter.get('/meal-planning', verify, getMealPlanningController)
userRouter.get('/meal-planning/:mealPlanId', verify, getMealPlanningByIdController)
userRouter.put('/meal-planning/:mealPlanId', verify, upload.single('recipeImage'), updateMealPlanningController)
userRouter.delete('/meal-planning/:mealPlanId', verify, deleteMealPlanningController)

export default userRouter