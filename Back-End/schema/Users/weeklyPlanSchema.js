import mongoose from 'mongoose';

// ── Meal slot: snapshot of the assigned recipe ────────────────────────────────
// We store a snapshot (not just an ObjectId) so the plan displays correctly
// even if the recipe is later edited or deleted.
const mealSlotSchema = new mongoose.Schema(
  {
    recipeId:        { type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan', default: null },
    recipeName:      { type: String, default: null },
    recipeImage:     { type: String, default: null },
    cuisineType:     { type: String, default: null },
    preparationTime: { type: Number, default: 0 },
    cookingTime:     { type: Number, default: 0 },
    servingSize:     { type: Number, default: 0 },
    difficultyLevel: { type: String, default: null },
  },
  { _id: false }
);

// ── One day: a date + 4 meal slots ───────────────────────────────────────────
const daySchema = new mongoose.Schema(
  {
    date:      { type: Date, required: true },
    breakfast: { type: mealSlotSchema, default: null },
    lunch:     { type: mealSlotSchema, default: null },
    dinner:    { type: mealSlotSchema, default: null },
    snack:     { type: mealSlotSchema, default: null },
  },
  { _id: false }
);

// ── Weekly plan: 7 days anchored to a Monday start date ──────────────────────
const weeklyPlanSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    // Always stored as the Monday of the selected week (normalized in controller)
    startDate: {
      type:     Date,
      required: true,
    },
    days: {
      type:    [daySchema],
      default: [],
    },
  },
  { timestamps: true }
);

// One plan per user per week — prevents duplicate entries
weeklyPlanSchema.index({ user: 1, startDate: 1 }, { unique: true });

export default mongoose.model('WeeklyPlan', weeklyPlanSchema);