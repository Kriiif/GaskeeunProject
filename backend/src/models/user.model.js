import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/
  },

  phone: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user'
  },

  img_path: {
    type: String,
    default: ''
  },

  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
})

const User = mongoose.model('User', userSchema);

export default User;