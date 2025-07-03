import express from 'express';
import PartnerRequest from '../models/partner_req.model.js';
import Venue from '../models/venue.model.js';
import { upload } from '../middlewares/upload.middleware.js';
import authorize from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', upload.fields([
    { name: 'fotoSuratTanah', maxCount: 1 },
    { name: 'fotoKTP', maxCount: 1 },
    { name: 'fotoVenue', maxCount: 1 }
]), authorize, async (req, res) => {
    try {        const { namaPemilik,
            namaVenue,
            npwp,
            nomorTelepon,
            email,
            lokasiVenue,
            nomorIndukBerusaha } = req.body;

        if (!namaPemilik || !namaVenue || !npwp || !nomorTelepon || !email || !lokasiVenue || !nomorIndukBerusaha) {
            return res.status(400).json({ message: 'Semua field wajib diisi dan file wajib diupload.' });
        }

        const fotoSuratTanah = req.files.fotoSuratTanah[0].filename;
        const fotoKTP = req.files.fotoKTP[0].filename;
        const fotoVenue = req.files.fotoVenue[0].filename;

        const image_url = req.file ? `/uploads/${req.file.filename}` : null;        const partnerReq = new PartnerRequest({
            user_id: req.user._id,
            namaPemilik,
            namaVenue,
            npwp,
            nomorTelepon,
            email,
            lokasiVenue,
            nomorIndukBerusaha,
            fotoSuratTanah,
            fotoKTP,
            fotoVenue
        });

        await partnerReq.save();

        res.status(201).json({
            message: 'Permohonan partnership berhasil dikirim!',
            partnerReq
        });
    } catch (err) {
        console.error('Error saat submit partnership:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan di server' });
    }
});

// Get all partnership requests (admin only)
router.get('/', authorize, async (req, res) => {
    try {
        const partnerRequests = await PartnerRequest.find({})
            .populate('user_id', 'name email')
            .sort({ created_at: -1 });

        res.status(200).json({
            success: true,
            data: partnerRequests
        });
    } catch (err) {
        console.error('Error fetching partnership requests:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan di server' });
    }
});

// Update partnership request status (admin only)
router.put('/:id/status', authorize, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['on hold', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status tidak valid' });
        }

        const partnerRequest = await PartnerRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('user_id', 'name email');

        if (!partnerRequest) {
            return res.status(404).json({ message: 'Partnership request tidak ditemukan' });
        }

        // If status is approved, create a new venue
        if (status === 'approved') {
            // Check if venue already exists for this partnership request
            const existingVenue = await Venue.findOne({ partner_req_id: id });
            
            if (!existingVenue) {
                const newVenue = new Venue({
                    description: `${partnerRequest.namaVenue} - ${partnerRequest.lokasiVenue}`,
                    partner_req_id: id,
                    status: 'active'
                });

                await newVenue.save();
                console.log('New venue created:', newVenue);
            }
        }

        res.status(200).json({
            success: true,
            message: status === 'approved' 
                ? 'Partnership request disetujui dan venue berhasil dibuat!' 
                : 'Status partnership request berhasil diupdate',
            data: partnerRequest
        });
    } catch (err) {
        console.error('Error updating partnership request status:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan di server' });
    }
});

// Get venue by partnership request ID
router.get('/:id/venue', authorize, async (req, res) => {
    try {
        const { id } = req.params;
        
        const venue = await Venue.findOne({ partner_req_id: id })
            .populate('partner_req_id');

        if (!venue) {
            return res.status(404).json({ message: 'Venue tidak ditemukan untuk partnership request ini' });
        }

        res.status(200).json({
            success: true,
            data: venue
        });
    } catch (err) {
        console.error('Error fetching venue:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan di server' });
    }
});

export default router;