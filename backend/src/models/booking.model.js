import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
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
  
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
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