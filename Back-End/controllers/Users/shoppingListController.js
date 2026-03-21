import ShoppingList from '../../schema/Users/shoppingListSchema.js';
import WeeklyPlan   from '../../schema/Users/weeklyPlanSchema.js';
import { MealPlanning } from '../../schema/Users/mealPlanningSchema.js';

// ── Helper: normalize date to Monday ──────────────────────────────────────────
const toMonday = (dateInput) => {
  const d = new Date(dateInput);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d;
};

// ── Helper: group + sum ingredients from multiple recipes ─────────────────────
// Groups by ingredient name (case-insensitive).
// If same name + same unit → add quantities.
// If same name + different unit → keep separate entries.
const groupIngredients = (recipes) => {
  const map = new Map(); // key: "name||unit"

  for (const recipe of recipes) {
    if (!recipe?.ingredients?.length) continue;
    for (const ing of recipe.ingredients) {
      if (!ing?.name) continue;

      const name    = ing.name.trim().toLowerCase();
      const unit    = (ing.unit || '').trim().toLowerCase();
      const qty     = parseFloat(ing.quantity) || 0;
      const display = ing.name.trim(); // preserve original casing
      const key     = `${name}||${unit}`;

      if (map.has(key)) {
        const existing = map.get(key);
        existing.quantity += qty;
        if (!existing.recipeNames.includes(recipe.recipeName)) {
          existing.recipeNames.push(recipe.recipeName);
        }
      } else {
        map.set(key, {
          name:        display,
          quantity:    qty,
          unit:        ing.unit?.trim() || '',
          isChecked:   false,
          isCustom:    false,
          recipeNames: [recipe.recipeName],
        });
      }
    }
  }

  return Array.from(map.values());
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Generate shopping list from current week's meal plan
// @route POST /api/v1/user/shopping-list/generate
// @access Private
// Body: { startDate: 'YYYY-MM-DD' }
// ─────────────────────────────────────────────────────────────────────────────
export const generateShoppingList = async (req, res) => {
  try {
    const { startDate } = req.body;
    if (!startDate) {
      return res.status(400).json({ message: 'startDate is required' });
    }

    const monday = toMonday(new Date(startDate));

    // 1. Get the weekly plan for this user + week
    const weeklyPlan = await WeeklyPlan.findOne({
      user:      req.user.id,
      startDate: monday,
    });

    if (!weeklyPlan || !weeklyPlan.days?.length) {
      return res.status(404).json({ message: 'No meal plan found for this week' });
    }

    // 2. Collect all unique recipe IDs from the plan
    const recipeIds = new Set();
    for (const day of weeklyPlan.days) {
      for (const meal of ['breakfast', 'lunch', 'dinner', 'snack']) {
        const slot = day[meal];
        if (slot?.recipeId) recipeIds.add(slot.recipeId.toString());
      }
    }

    if (recipeIds.size === 0) {
      return res.status(400).json({ message: 'No recipes assigned in this week\'s plan' });
    }

    // 3. Fetch full recipe documents (need ingredients array)
    const recipes = await MealPlanning.find({
      _id: { $in: Array.from(recipeIds) },
    }).select('recipeName ingredients');

    // 4. Group and sum ingredients
    const grouped = groupIngredients(recipes);

    // 5. Upsert shopping list — preserve any custom items if list already exists
    const existing = await ShoppingList.findOne({ user: req.user.id, startDate: monday });
    const customItems = existing ? existing.items.filter(i => i.isCustom) : [];

    const list = await ShoppingList.findOneAndUpdate(
      { user: req.user.id, startDate: monday },
      { user: req.user.id, startDate: monday, items: [...grouped, ...customItems] },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json(list);
  } catch (error) {
    console.error('generateShoppingList error:', error);
    res.status(500).json({ message: 'Server error generating shopping list' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Get shopping list for a given week
// @route GET /api/v1/user/shopping-list?startDate=YYYY-MM-DD
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
export const getShoppingList = async (req, res) => {
  try {
    const { startDate } = req.query;
    if (!startDate) {
      return res.status(400).json({ message: 'startDate query param is required' });
    }

    const monday = toMonday(new Date(startDate));
    const list   = await ShoppingList.findOne({ user: req.user.id, startDate: monday });

    if (!list) {
      return res.status(200).json({ startDate: monday, items: [] });
    }

    res.status(200).json(list);
  } catch (error) {
    console.error('getShoppingList error:', error);
    res.status(500).json({ message: 'Server error fetching shopping list' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Toggle checked state of an item
// @route PATCH /api/v1/user/shopping-list/toggle
// @access Private
// Body: { startDate, itemId }
// ─────────────────────────────────────────────────────────────────────────────
export const toggleItem = async (req, res) => {
  try {
    const { startDate, itemId } = req.body;
    if (!startDate || !itemId) {
      return res.status(400).json({ message: 'startDate and itemId are required' });
    }

    const monday = toMonday(new Date(startDate));
    const list   = await ShoppingList.findOne({ user: req.user.id, startDate: monday });
    if (!list) return res.status(404).json({ message: 'Shopping list not found' });

    const item = list.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.isChecked = !item.isChecked;
    list.markModified('items');
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    console.error('toggleItem error:', error);
    res.status(500).json({ message: 'Server error toggling item' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Delete a single item
// @route DELETE /api/v1/user/shopping-list/item
// @access Private
// Body: { startDate, itemId }
// ─────────────────────────────────────────────────────────────────────────────
export const deleteItem = async (req, res) => {
  try {
    const { startDate, itemId } = req.body;
    if (!startDate || !itemId) {
      return res.status(400).json({ message: 'startDate and itemId are required' });
    }

    const monday = toMonday(new Date(startDate));
    const list   = await ShoppingList.findOne({ user: req.user.id, startDate: monday });
    if (!list) return res.status(404).json({ message: 'Shopping list not found' });

    list.items = list.items.filter(i => i._id.toString() !== itemId);
    list.markModified('items');
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    console.error('deleteItem error:', error);
    res.status(500).json({ message: 'Server error deleting item' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Add a custom item manually
// @route POST /api/v1/user/shopping-list/item
// @access Private
// Body: { startDate, name, quantity, unit }
// ─────────────────────────────────────────────────────────────────────────────
export const addCustomItem = async (req, res) => {
  try {
    const { startDate, name, quantity, unit } = req.body;
    if (!startDate || !name) {
      return res.status(400).json({ message: 'startDate and name are required' });
    }

    const monday = toMonday(new Date(startDate));

    const list = await ShoppingList.findOneAndUpdate(
      { user: req.user.id, startDate: monday },
      {
        $push: {
          items: {
            name,
            quantity:    parseFloat(quantity) || 0,
            unit:        unit || '',
            isChecked:   false,
            isCustom:    true,
            recipeNames: [],
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json(list);
  } catch (error) {
    console.error('addCustomItem error:', error);
    res.status(500).json({ message: 'Server error adding item' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Clear entire shopping list for a week
// @route DELETE /api/v1/user/shopping-list?startDate=YYYY-MM-DD
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
export const clearShoppingList = async (req, res) => {
  try {
    const { startDate } = req.query;
    if (!startDate) {
      return res.status(400).json({ message: 'startDate is required' });
    }

    const monday = toMonday(new Date(startDate));
    await ShoppingList.findOneAndDelete({ user: req.user.id, startDate: monday });

    res.status(200).json({ message: 'Shopping list cleared' });
  } catch (error) {
    console.error('clearShoppingList error:', error);
    res.status(500).json({ message: 'Server error clearing list' });
  }
};