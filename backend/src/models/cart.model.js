import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
  fieldName: { type: String, required: true },
  fieldImage: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  numericPrice: { type: Number, required: true },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
