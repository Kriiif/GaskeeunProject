import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  field_times_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field_Times',
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
