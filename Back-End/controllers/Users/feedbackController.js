import Feedback     from '../../schema/Users/feedbackSchema.js';
import { MealPlanning } from '../../schema/Users/mealPlanningSchema.js';

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Get all feedback for a recipe
// @route GET /api/v1/user/feedback/:recipeId
// @access Public
// ─────────────────────────────────────────────────────────────────────────────
export const getRecipeFeedback = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const feedback = await Feedback.find({ recipe: recipeId })
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate average rating
    const avgRating = feedback.length
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : 0;

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedback.forEach(f => { ratingCounts[f.rating] = (ratingCounts[f.rating] || 0) + 1; });

    res.status(200).json({
      feedback,
      avgRating: parseFloat(avgRating),
      totalReviews: feedback.length,
      ratingCounts,
    });
  } catch (error) {
    console.error('getRecipeFeedback error:', error);
    res.status(500).json({ message: 'Server error fetching feedback' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Submit or update feedback for a recipe
// @route POST /api/v1/user/feedback/:recipeId
// @access Private
// Body: { rating: 1-5, comment: string }
// ─────────────────────────────────────────────────────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    const { recipeId }       = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Upsert — one review per user per recipe
    const feedback = await Feedback.findOneAndUpdate(
      { recipe: recipeId, user: req.user.id },
      {
        recipe:   recipeId,
        user:     req.user.id,
        userName: req.user.email.split('@')[0], // fallback name from email
        rating:   parseInt(rating),
        comment:  comment?.trim() || '',
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Recalculate and update average rating on the recipe
    const allFeedback = await Feedback.find({ recipe: recipeId });
    const avgRating   = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;

    await MealPlanning.findByIdAndUpdate(recipeId, {
      rating: parseFloat(avgRating.toFixed(1)),
    });

    res.status(200).json({ feedback, avgRating: parseFloat(avgRating.toFixed(1)) });
  } catch (error) {
    console.error('submitFeedback error:', error);
    res.status(500).json({ message: 'Server error submitting feedback' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc  Delete own feedback
// @route DELETE /api/v1/user/feedback/:recipeId
// @access Private
// ─────────────────────────────────────────────────────────────────────────────
export const deleteFeedback = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const deleted = await Feedback.findOneAndDelete({
      recipe: recipeId,
      user:   req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Recalculate average rating after deletion
    const remaining = await Feedback.find({ recipe: recipeId });
    const avgRating  = remaining.length
      ? remaining.reduce((sum, f) => sum + f.rating, 0) / remaining.length
      : 0;

    await MealPlanning.findByIdAndUpdate(recipeId, {
      rating: parseFloat(avgRating.toFixed(1)),
    });

    res.status(200).json({ message: 'Review deleted', avgRating });
  } catch (error) {
    console.error('deleteFeedback error:', error);
    res.status(500).json({ message: 'Server error deleting feedback' });
  }
};