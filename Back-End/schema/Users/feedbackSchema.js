import mongoose from 'mongoose';

const { Schema } = mongoose;

const feedbackSchema = new Schema({
  recipe: {
    type:     Schema.Types.ObjectId,
    ref:      'MealPlanning',
    required: true,
  },
  user: {
    type:     Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type:     Number,
    required: true,
    min:      1,
    max:      5,
  },
  comment: {
    type:    String,
    default: '',
    maxlength: 500,
  },
}, { timestamps: true });

// One review per user per recipe
feedbackSchema.index({ recipe: 1, user: 1 }, { unique: true });

export default mongoose.model('Feedback', feedbackSchema);