import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true
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
  field_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true
  },
  booking_date: {
    type: String,
    required: true
  },
  booking_time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;