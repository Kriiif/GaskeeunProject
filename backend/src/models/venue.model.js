import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  location: { // Ini akan digunakan untuk kota
    type: String,
    required: true
  },
  address: { // Ini untuk alamat lengkap
    type: String,
    required: true
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Setiap user hanya bisa punya 1 venue
  }
}, { timestamps: true });

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;
