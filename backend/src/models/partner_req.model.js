import mongoose from "mongoose";

const partnerReqSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    namaPemilik: {
        type: String, required: true, trim: true
    },
    
    fotoSuratTanah: {
        type: String, required: true
    },

    fotoKTP: {
        type: String, required: true
    },

    npwp: {
        type: String, required: true, trim: true
    },
    
    nomorIndukBerusaha: {
        type: String, required: true, trim: true
    },

    fotoVenue: {
        type: String, required: true
    },
    
    nomorTelepon: {
        type: String, required: true, trim: true
    },

    email: {
        type: String, required: true, trim: true, lowercase: true
    },

    lokasiVenue: {
        type: String, required: true, trim: true
    },

    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

const PartnerRequest = mongoose.model('PartnerRequest', partnerReqSchema);

export default PartnerRequest;