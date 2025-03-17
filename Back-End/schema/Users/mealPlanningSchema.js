import mongoose from "mongoose"

const { Schema } = mongoose

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: [true, "Ingredient name is required"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"]
  },
  unit: {
    type: String,
    required: [true, "Unit is required"]
  }
})

const mealPlanningSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeName: {
    type: String,
    required: [true, "Recipe name is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  cuisineType: {
    type: String,
    required: [true, "Cuisine type is required"],
    enum: ['Italian', 'Indian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'American', 'French', 'Mediterranean', 'Other']
  },
  preparationTime: {
    type: Number,
    required: [true, "Preparation time is required"]
  },
  cookingTime: {
    type: Number,
    required: [true, "Cooking time is required"]
  },
  servingSize: {
    type: Number,
    required: [true, "Serving size is required"]
  },
  difficultyLevel: {
    type: String,
    required: [true, "Difficulty level is required"],
    enum: ['Easy', 'Medium', 'Hard']
  },
  ingredients: [ingredientSchema],
  instructions: {
    type: String,
    required: [true, "Instructions are required"]
  },
  tags: [{
    type: String
  }],
  recipeImage: {
    type: String,
    required: [true, "Recipe image is required"]
  },
  dietaryRestrictions: [{
    type: String,
    enum: ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher']
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

export const MealPlanning = mongoose.model('MealPlanning', mealPlanningSchema)