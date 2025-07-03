import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  venue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
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

  open_hour: {
    type: String,
    required: true
  },

  close_hour: {
    type: String,
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
  }
}, {
  versionKey: false
});

const Field = mongoose.model('Field', fieldSchema);
export default Field;
