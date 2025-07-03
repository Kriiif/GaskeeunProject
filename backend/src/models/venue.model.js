import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['active', 'banned'],
        default: 'active'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    partner_req_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartnerRequest',
        required: true
    },
}, { timestamps: true });

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;
