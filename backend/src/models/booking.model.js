import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: false, // No longer required for every booking, will be set by payment transaction
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  field_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true
  }],
  booking_date: {
    type: Date,
    required: true
  },
  booking_time: {
    type: String,
    required: true
  },
  total_price: {
    type: Number,
    required: true
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.index({ order_id: 1 }, { unique: true, sparse: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;