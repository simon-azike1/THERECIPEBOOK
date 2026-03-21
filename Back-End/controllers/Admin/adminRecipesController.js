import { MealPlanning } from '../../schema/Users/mealPlanningSchema.js';
import Admin            from '../../schema/Admin/authSchema.js';
import { hashPassword, verifyPassword } from '../../utils/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Get ALL recipes from all users
// @route GET /api/v1/admin/recipes
// @access Admin (no middleware for now)
// ─────────────────────────────────────────────────────────────────────────────
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await MealPlanning.find({})
      .populate('userId', 'name email')  // ← userId matches your schema field
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    console.error('getAllRecipes error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching recipes' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Delete any recipe by ID
// @route DELETE /api/v1/admin/recipes/:recipeId
// @access Admin (no middleware for now)
// ─────────────────────────────────────────────────────────────────────────────
export const deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await MealPlanning.findByIdAndDelete(recipeId);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.status(200).json({ success: true, message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('deleteRecipe error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting recipe' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Change admin password
// @route PATCH /api/v1/admin/settings/change-password
// @access Admin (no middleware for now)
// Body: { adminId, currentPassword, newPassword }
// ─────────────────────────────────────────────────────────────────────────────
export const changeAdminPassword = async (req, res) => {
  try {
    const { adminId, currentPassword, newPassword } = req.body;

    if (!adminId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'adminId, currentPassword and newPassword are all required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const isValid = await verifyPassword(currentPassword, admin.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    admin.password = await hashPassword(newPassword);
    await admin.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('changeAdminPassword error:', error);
    res.status(500).json({ success: false, message: 'Server error changing password' });
  }
};