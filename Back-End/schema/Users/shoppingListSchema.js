import mongoose from 'mongoose';

const { Schema } = mongoose;

// Individual item on the list
const shoppingItemSchema = new Schema({
  name:        { type: String, required: true },
  quantity:    { type: Number, default: 0 },
  unit:        { type: String, default: '' },
  isChecked:   { type: Boolean, default: false },
  isCustom:    { type: Boolean, default: false }, // true = user added manually
  recipeNames: [{ type: String }],               // which recipes need this item
}, { _id: true });

// One shopping list per user per week (linked to weekly plan start date)
const shoppingListSchema = new Schema({
  user: {
    type:     Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  // Tied to the same startDate as WeeklyPlan so they stay in sync
  startDate: {
    type:     Date,
    required: true,
  },
  items: {
    type:    [shoppingItemSchema],
    default: [],
  },
}, { timestamps: true });

// One list per user per week
shoppingListSchema.index({ user: 1, startDate: 1 }, { unique: true });

export default mongoose.model('ShoppingList', shoppingListSchema);