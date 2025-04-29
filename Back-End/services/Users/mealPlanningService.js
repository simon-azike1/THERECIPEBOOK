import { MealPlanning } from '../../schema/Users/mealPlanningSchema.js'
import { User } from '../../schema/Users/authSchema.js'
import { messageHandler } from '../../utils/index.js'
import { BAD_REQUEST, SUCCESS, NOT_FOUND, UNAUTHORIZED } from '../../constants/statusCode.js'

export const createMealPlanningService = async ({userId, data, files}, callback) => {
  try {
    // Check if user is approved
    const user = await User.findById(userId);
    if (!user) {
      return callback(messageHandler("User not found", false, NOT_FOUND, {}));
    }
    
    if (!user.isApproved) {
      return callback(messageHandler("Your account needs to be approved before creating recipes", false, UNAUTHORIZED, {}));
    }

    if (!files || !files.recipeImage || !files.recipeImage[0]) {
      return callback(messageHandler("Recipe image is required", false, BAD_REQUEST, {}));
    }

    try {
      // Parse JSON strings if they exist
      const parsedData = {
        ...data,
        ingredients: data.ingredients ? JSON.parse(data.ingredients) : [],
        dietaryRestrictions: data.dietaryRestrictions ? JSON.parse(data.dietaryRestrictions) : [],
        tags: data.tags ? JSON.parse(data.tags) : []
      };

      const mealPlan = new MealPlanning({
        userId,
        ...parsedData,
        recipeImage: files.recipeImage[0].path // Cloudinary already handled the upload
      });

      const savedMealPlan = await mealPlan.save();
      return callback(messageHandler("Meal plan created successfully", true, SUCCESS, savedMealPlan));
    } catch (parseError) {
      console.error('Error parsing data:', parseError);
      return callback(messageHandler("Invalid data format", false, BAD_REQUEST, {}));
    }

  } catch (error) {
    console.error('Error in createMealPlanningService:', error);
    return callback(messageHandler(error.message || "Failed to create meal plan", false, BAD_REQUEST, {}));
  }
}

export const getMealPlanningService = async ({userId}, callback) => {
  MealPlanning.find({ userId }).exec((err, mealPlans) => {
    if (err) {
      return callback(messageHandler("Failed to fetch meal plans", false, BAD_REQUEST, {}))
    }
    return callback(messageHandler("Meal plans fetched successfully", true, SUCCESS, mealPlans))
  })
}

export const getMealPlanningByIdService = async ({userId, mealPlanId}, callback) => {
  MealPlanning.findOne({ _id: mealPlanId, userId }).exec((err, mealPlan) => {
    if (err) {
      return callback(messageHandler("Failed to fetch meal plan", false, BAD_REQUEST, {}))
    }
    if (!mealPlan) {
      return callback(messageHandler("Meal plan not found", false, NOT_FOUND, {}))
    }
    return callback(messageHandler("Meal plan fetched successfully", true, SUCCESS, mealPlan))
  })
}

export const updateMealPlanningService = async ({userId, mealPlanId, data, files}, callback) => {
  try {
    const mealPlan = await MealPlanning.findOne({ _id: mealPlanId, userId });

    if (!mealPlan) {
      return callback(messageHandler("Meal plan not found", false, NOT_FOUND, {}));
    }

    // Parse JSON strings if they exist
    const parsedData = {
      ...data,
      ingredients: data.ingredients ? JSON.parse(data.ingredients) : undefined,
      dietaryRestrictions: data.dietaryRestrictions ? JSON.parse(data.dietaryRestrictions) : undefined,
      tags: data.tags ? JSON.parse(data.tags) : undefined
    };

    // Only update recipeImage if a new file is provided
    if (files && files.recipeImage) {
      parsedData.recipeImage = files.recipeImage[0].path;
    }

    // Remove undefined values
    Object.keys(parsedData).forEach(key => 
      parsedData[key] === undefined && delete parsedData[key]
    );

    Object.assign(mealPlan, parsedData);
    const updatedMealPlan = await mealPlan.save();
    return callback(messageHandler("Meal plan updated successfully", true, SUCCESS, updatedMealPlan));

  } catch (error) {
    console.error('Error in updateMealPlanningService:', error);
    return callback(messageHandler("Failed to update meal plan", false, BAD_REQUEST, error));
  }
}

export const deleteMealPlanningService = async ({userId, mealPlanId}, callback) => {
  MealPlanning.findOneAndDelete({ _id: mealPlanId, userId }).exec((err, mealPlan) => {
    if (err) {
      return callback(messageHandler("Failed to delete meal plan", false, BAD_REQUEST, {}))
    }
    if (!mealPlan) {
      return callback(messageHandler("Meal plan not found", false, NOT_FOUND, {}))
    }
    return callback(messageHandler("Meal plan deleted successfully", true, SUCCESS, {}))
  })
}

export const getAllRecipesService = async (callback) => {
  try {
    const recipes = await MealPlanning.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    if (!recipes) {
      return callback(messageHandler("No recipes found", false, NOT_FOUND, []));
    }

    return callback(messageHandler("Recipes fetched successfully", true, SUCCESS, recipes));
  } catch (error) {
    console.error('Error in getAllRecipesService:', error);
    return callback(messageHandler("Failed to fetch recipes", false, BAD_REQUEST, {}));
  }
};

export const getUserRecipesService = async ({ userId }, callback) => {
  try {
    const userRecipes = await MealPlanning.find({ userId })
      .sort({ createdAt: -1 });

    if (!userRecipes) {
      return callback(messageHandler("No recipes found for this user", false, NOT_FOUND, []));
    }

    return callback(messageHandler("User recipes fetched successfully", true, SUCCESS, userRecipes));
  } catch (error) {
    console.error('Error in getUserRecipesService:', error);
    return callback(messageHandler("Failed to fetch user recipes", false, BAD_REQUEST, {}));
  }
};
