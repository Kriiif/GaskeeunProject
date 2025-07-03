import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true
  },

  image_url: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  desc: {
    type: String,
    required: true
  },

  is_active: {
    type: Boolean,
    default: true
  },

  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

const Field = mongoose.model('Field', fieldSchema);
export default Field;
