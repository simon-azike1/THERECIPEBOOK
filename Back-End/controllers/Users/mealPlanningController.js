import { 
  createMealPlanningService, 
  getMealPlanningService, 
  getMealPlanningByIdService, 
  updateMealPlanningService, 
  deleteMealPlanningService,
  getAllRecipesService,
  getUserRecipesService
} from '../../services/Users/mealPlanningService.js'

export const createMealPlanningController = async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        result: {
          message: "Unauthorized",
          success: false,
          statusCode: 401,
          data: {}
        }
      });
    }

    // Basic validation
    const requiredFields = ['recipeName', 'description', 'cuisineType', 'preparationTime', 
                          'cookingTime', 'servingSize', 'difficultyLevel', 'instructions'];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        result: {
          message: `Missing required fields: ${missingFields.join(', ')}`,
          success: false,
          statusCode: 400,
          data: {}
        }
      });
    }

    // Check for file
    if (!req.files || !req.files.recipeImage) {
      return res.status(400).json({
        result: {
          message: "Recipe image is required",
          success: false,
          statusCode: 400,
          data: {}
        }
      });
    }

    const userId = req.user.id;
    return await createMealPlanningService(
      { 
        userId, 
        data: req.body, 
        files: req.files 
      }, 
      (result) => {
        return res.status(result.statusCode).json({ result });
      }
    );
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
  return await updateMealPlanningService({ userId, mealPlanId, data: req.body, files: req.files }, (result) => {
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

// Get all recipes (unprotected, but requires authentication)
export const getAllRecipesController = async (req, res) => {
    return await getAllRecipesService((result) => {
      return res.status(result.statusCode).json({ result });
    });

};

// Get user's own recipes
export const getUserRecipesController = async (req, res) => {
    const userId = req.user.id;
    return await getUserRecipesService({ userId }, (result) => {
      return res.status(result.statusCode).json({ result });
    });
}
