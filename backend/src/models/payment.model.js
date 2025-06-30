import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },

  amount: {
    type: Number
  },

  method: {
    type: String
  },

  status: {
    type: String,
    enum: ['PAID', 'PENDING', 'FAILED'],
    default: 'PENDING'
  },

  paid_at: {
    type: Date
  },

  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
