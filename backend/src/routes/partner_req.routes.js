import express from 'express';
import PartnerRequest from '../models/partner_req.model.js';
import { upload } from '../middlewares/upload.middleware.js';
import authorize from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', upload.fields([
    { name: 'fotoSuratTanah', maxCount: 1 },
    { name: 'fotoKTP', maxCount: 1 },
    { name: 'fotoVenue', maxCount: 1 }
]), authorize, async (req, res) => {
    try {
        const { namaPemilik,
            npwp,
            nomorTelepon,
            email,
            lokasiVenue,
            nomorIndukBerusaha } = req.body;

        if (!namaPemilik || !npwp || !nomorTelepon || !email || !lokasiVenue || !nomorIndukBerusaha) {
            return res.status(400).json({ message: 'Semua field wajib diisi dan file wajib diupload.' });
        }

        const fotoSuratTanah = req.files.fotoSuratTanah[0].filename;
        const fotoKTP = req.files.fotoKTP[0].filename;
        const fotoVenue = req.files.fotoVenue[0].filename;

        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const partnerReq = new PartnerRequest({
            user_id: req.user._id,
            namaPemilik,
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

export default router;