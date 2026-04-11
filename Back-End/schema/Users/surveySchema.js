import mongoose from 'mongoose';

const { Schema } = mongoose;

const surveySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  option: {
    type: String,
    required: true,
    enum: ['Deciding meals', 'Finding cultural recipes', 'Organizing recipes', 'Planning ahead', 'Keeping it simple', 'Other'],
  },
  feedback: {
    type: String,
    maxlength: 500,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

surveySchema.index({ user: 1, submittedAt: -1 });

export default mongoose.model('Survey', surveySchema);
