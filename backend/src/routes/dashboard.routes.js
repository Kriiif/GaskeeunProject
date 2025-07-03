// Import necessary modules and middleware
import express from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import authorize from '../middlewares/auth.middleware.js';
import Venue from '../models/venue.model.js';
import Booking from '../models/booking.model.js';
import Field from '../models/field.model.js';
import PartnerRequest from '../models/partner_req.model.js';

const router = express.Router();

// GET /api/v1/dashboard/owner/recent-orders
router.get('/recent-orders', authorize, async (req, res) => {
  try {
    const userId = req.user._id;
    // Cari partner request yang sudah approved untuk user ini
    const partnerReq = await PartnerRequest.findOne({ user_id: userId, status: 'approved' });
    if (!partnerReq) {
      return res.json({ orders: [], message: 'No approved partner request found for this user.' });
    }
    // Cari venue yang partner_req_id-nya sama dengan partnerReq._id
    const venues = await Venue.find({ partner_req_id: partnerReq._id });
    if (!venues.length) {
      return res.json({ orders: [], message: 'No venue found for this partner request.' });
    }
    const venueIds = venues.map(v => v._id);
    // Cari booking yang venue_id-nya ada di venueIds
    // Booking sample: {
    //   _id: ObjectId('6866ee20f45ad63b1482c5c9'),
    //   order_id: 'TRX-98f96423-dc69-49bc-a466-9ba508887e77',
    //   user_id: ObjectId('6866a9ab5b0a396b1c2db7fc'),
    //   venue_id: ObjectId('6866cf05f07fc14751b1aff2'),
    //   field_id: ObjectId('6866ded2023ecd1c146bb446'),
    //   booking_date: '04 Juli 2025',
    //   booking_time: '02:00 - 03:00',
    //   status: 'COMPLETED',
    //   created_at: ISODate('2025-07-03T20:54:56.529+00:00')
    // }
    const bookings = await Booking.find({ venue_id: { $in: venueIds } })
      .sort({ created_at: -1 })
      .limit(10)
      .populate({ path: 'user_id', select: 'name' })
      .populate({ path: 'field_id', select: 'name price venue_id', populate: { path: 'venue_id', select: 'partner_req_id' } })
      .populate({ path: 'venue_id', select: 'partner_req_id' });

    // Untuk setiap booking, ambil nama venue dari partner_req
    const orders = await Promise.all(bookings.map(async (b) => {
      let venueName = '-';
      let partnerReqId = b.venue_id?.partner_req_id || b.field_id?.venue_id?.partner_req_id;
      if (partnerReqId) {
        // Cari partner request untuk dapatkan namaVenue
        const partnerReq = await PartnerRequest.findById(partnerReqId);
        if (partnerReq) venueName = partnerReq.namaVenue;
      }
      return {
        id: b.order_id,
        customer: b.user_id?.name || '-',
        venue: venueName,
        field: b.field_id?.name || '-',
        price: b.field_id?.price || null,
        date: b.booking_date,
        session: b.booking_time,
        status: b.status
      };
    }));
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// GET /api/v1/dashboard/owner/stats
router.get('/stats', authorize, async (req, res) => {
  try {
    const userId = req.user._id;
    // Cari partner request yang sudah approved untuk user ini
    const partnerReq = await PartnerRequest.findOne({ user_id: userId, status: 'approved' });
    if (!partnerReq) {
      return res.json({ stats: { totalRevenue: 0, totalReservations: 0, revenueGrowth: 0, reservationsGrowth: 0 } });
    }
    // Cari venue yang partner_req_id-nya sama dengan partnerReq._id
    const venues = await Venue.find({ partner_req_id: partnerReq._id });
    if (!venues.length) {
      return res.json({ stats: { totalRevenue: 0, totalReservations: 0, revenueGrowth: 0, reservationsGrowth: 0 } });
    }
    const venueIds = venues.map(v => v._id);
    // Ambil semua booking untuk venue ini
    const bookings = await Booking.find({ venue_id: { $in: venueIds }, status: { $in: ['CONFIRMED', 'COMPLETED'] } })
      .populate({ path: 'field_id', select: 'price' });
    // Hitung total pendapatan dari price field
    let totalRevenue = 0;
    bookings.forEach(b => {
      if (b.field_id && typeof b.field_id.price === 'number') {
        totalRevenue += b.field_id.price;
      }
    });
    const totalReservations = bookings.length;
    // Dummy growth calculation
    const revenueGrowth = 100;
    const reservationsGrowth = 10;
    res.json({
      stats: {
        totalRevenue,
        totalReservations,
        revenueGrowth,
        reservationsGrowth
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// Export the router to be used in the main app
export default router;