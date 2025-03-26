import { MealPlanning } from '../../schema/Users/mealPlanningSchema.js'
import { User } from '../../schema/Users/authSchema.js'
import { messageHandler } from '../../utils/index.js'
import { BAD_REQUEST, SUCCESS, NOT_FOUND, UNAUTHORIZED } from '../../constants/statusCode.js'
import { cloudinary } from '../../utils/index.js'

export const createMealPlanningService = async ({userId, data, file}, callback) => {
  try {
    // Check if user is approved
    const user = await User.findById(userId);
    if (!user) {
      return callback(messageHandler("User not found", false, NOT_FOUND, {}));
    }
    
    if (!user.isApproved) {
      return callback(messageHandler("Your account needs to be approved before creating recipes", false, UNAUTHORIZED, {}));
    }

    if (!file) {
      return callback(messageHandler("Recipe image is required", false, BAD_REQUEST, {}))
    }

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'recipe_images'
    })

    const mealPlan = new MealPlanning({
      userId,
      ...data,
      recipeImage: result.secure_url
    })

    return await mealPlan.save((err, mealPlan) => {
      if (err) {
        return callback(messageHandler("Failed to create meal plan", false, BAD_REQUEST, err))
      }
      return callback(messageHandler("Meal plan created successfully", true, SUCCESS, mealPlan))
    })
  } catch (error) {
    return callback(messageHandler("Something went wrong...", false, BAD_REQUEST, error))
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

export const updateMealPlanningService = async ({userId, mealPlanId, data, file}, callback) => {
  try {
    const mealPlan = await MealPlanning.findOne({ _id: mealPlanId, userId })

    if (!mealPlan) {
      return callback(messageHandler("Meal plan not found", false, NOT_FOUND, {}))
    }

    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'recipe_images'
      })
      data.recipeImage = result.secure_url
    }

    Object.assign(mealPlan, data)

    return mealPlan.save((err, updatedMealPlan) => {
      if (err) {
        return callback(messageHandler("Failed to update meal plan", false, BAD_REQUEST, err))
      }
      return callback(messageHandler("Meal plan updated successfully", true, SUCCESS, updatedMealPlan))
    })
  } catch (error) {
    return callback(messageHandler("Something went wrong...", false, BAD_REQUEST, error))
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
