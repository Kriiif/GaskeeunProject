import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  field_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  comment: {
    type: String
  },

  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
