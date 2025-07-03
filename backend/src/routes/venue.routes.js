import express from 'express';
import Venue from '../models/venue.model.js';
import authorize from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get all venues (public - no auth required)
router.get('/', async (req, res) => {
    try {
        const venues = await Venue.find({ status: 'active' }) // Only return active venues for public
            .populate({
                path: 'partner_req_id',
                populate: {
                    path: 'user_id',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: venues
        });
    } catch (err) {
        console.error('Error fetching venues:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan di server' });
    }
});

// Get all venues for admin (with auth)
router.get('/admin', authorize, async (req, res) => {
    try {
        const venues = await Venue.find({})
            .populate({
                path: 'partner_req_id',
                populate: {
                    path: 'user_id',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: venues
        });
    } catch (err) {
        console.error('Error fetching venues:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan di server' });
    }
});

// Get venue by ID
router.get('/:id', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id)
            .populate({
                path: 'partner_req_id',
                populate: {
                    path: 'user_id',
                    select: 'name email'
                }
            });

        if (!venue) {
            return res.status(404).json({ message: 'Venue tidak ditemukan' });
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

// Update venue status
router.put('/:id/status', authorize, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'banned'].includes(status)) {
            return res.status(400).json({ message: 'Status tidak valid' });
        }

        const venue = await Venue.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate({
            path: 'partner_req_id',
            populate: {
                path: 'user_id',
                select: 'name email'
            }
        });

        if (!venue) {
            return res.status(404).json({ message: 'Venue tidak ditemukan' });
        }

        res.status(200).json({
            success: true,
            message: 'Status venue berhasil diupdate',
            data: venue
        });
    } catch (err) {
        console.error('Error updating venue status:', err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan di server' });
    }
});

export default router;
