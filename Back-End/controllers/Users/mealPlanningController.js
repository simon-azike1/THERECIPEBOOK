import { 
  createMealPlanningService, 
  getMealPlanningService, 
  getMealPlanningByIdService, 
  updateMealPlanningService, 
  deleteMealPlanningService 
} from '../../services/Users/mealPlanningService.js'

export const createMealPlanningController = async (req, res) => {
  const userId = req.user.id
  return await createMealPlanningService({ userId, data: req.body, file: req.file }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}

export const getMealPlanningController = async (req, res) => {
  const userId = req.user.id
  return await getMealPlanningService({ userId }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}

export const getMealPlanningByIdController = async (req, res) => {
  const userId = req.user.id
  const { mealPlanId } = req.params
  return await getMealPlanningByIdService({ userId, mealPlanId }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}

export const updateMealPlanningController = async (req, res) => {
  const userId = req.user.id
  const { mealPlanId } = req.params
  return await updateMealPlanningService({ userId, mealPlanId, data: req.body, file: req.file }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}

export const deleteMealPlanningController = async (req, res) => {
  const userId = req.user.id
  const { mealPlanId } = req.params
  return await deleteMealPlanningService({ userId, mealPlanId }, (result) => {
    return res.status(result.statusCode).json({ result })
  })
}
