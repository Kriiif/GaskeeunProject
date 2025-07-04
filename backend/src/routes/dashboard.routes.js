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
router.get('/owner/recent-orders', authorize, async (req, res) => {
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
      .populate({ path: 'venue_id', select: 'partner_req_id' });    // Untuk setiap booking, ambil nama venue dari partner_req
    const orders = await Promise.all(bookings.map(async (b) => {
      let venueName = '-';
      let fieldName = '-';
      let fieldPrice = null;
      
      // Handle field_id as array
      const firstField = Array.isArray(b.field_id) ? b.field_id[0] : b.field_id;
      
      let partnerReqId = b.venue_id?.partner_req_id || firstField?.venue_id?.partner_req_id;
      if (partnerReqId) {
        // Cari partner request untuk dapatkan namaVenue
        const partnerReq = await PartnerRequest.findById(partnerReqId);
        if (partnerReq) venueName = partnerReq.namaVenue;
      }
      
      if (firstField) {
        fieldName = firstField.name || '-';
        fieldPrice = firstField.price || null;
      }
      
      return {
        id: b.order_id,
        customer: b.user_id?.name || '-',
        venue: venueName,
        field: fieldName,
        price: fieldPrice,
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
router.get('/owner/stats', authorize, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching stats for user:', userId);
    
    // Cari partner request yang sudah approved untuk user ini
    const partnerReq = await PartnerRequest.findOne({ user_id: userId, status: 'approved' });
    console.log('Partner request found:', partnerReq);
    
    if (!partnerReq) {
      console.log('No approved partner request found');
      return res.json({ stats: { totalRevenue: 0, totalReservations: 0, revenueGrowth: 0, reservationsGrowth: 0 } });
    }
    
    // Cari venue yang partner_req_id-nya sama dengan partnerReq._id
    const venues = await Venue.find({ partner_req_id: partnerReq._id });
    console.log('Venues found:', venues);
    
    if (!venues.length) {
      console.log('No venues found for partner request');
      return res.json({ stats: { totalRevenue: 0, totalReservations: 0, revenueGrowth: 0, reservationsGrowth: 0 } });
    }
    
    const venueIds = venues.map(v => v._id);
    console.log('Venue IDs:', venueIds);
    
    // Ambil semua booking untuk venue ini dengan status yang lebih lengkap
    const bookings = await Booking.find({ venue_id: { $in: venueIds }, status: { $in: ['CONFIRMED', 'COMPLETED', 'PAID'] } })
      .populate({ path: 'field_id', select: 'price' });
    console.log('Bookings found:', bookings.length);
    console.log('Sample booking:', bookings[0]);
    
    // Hitung total pendapatan dari price field
    let totalRevenue = 0;
    bookings.forEach(b => {
      console.log('Processing booking:', b._id, 'field_id:', b.field_id);
      // Handle field_id as array
      if (Array.isArray(b.field_id)) {
        b.field_id.forEach(field => {
          if (field && typeof field.price === 'number') {
            totalRevenue += field.price;
            console.log('Added price from array field:', field.price);
          }
        });
      } else if (b.field_id && typeof b.field_id.price === 'number') {
        totalRevenue += b.field_id.price;
        console.log('Added price from single field:', b.field_id.price);
      }
    });    const totalReservations = bookings.length;
    console.log('Total revenue calculated:', totalRevenue);
    console.log('Total reservations:', totalReservations);
    
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
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// GET /api/v1/dashboard/superadmin/stats
router.get('/superadmin/stats', authorize, async (req, res) => {
  try {
    // Total revenue: sum all field prices from bookings with CONFIRMED/COMPLETED/PAID
    const bookings = await Booking.find({ status: { $in: ['CONFIRMED', 'COMPLETED', 'PAID'] } }).populate({ path: 'field_id', select: 'price' });
    let totalRevenue = 0;
    bookings.forEach(b => {
      if (Array.isArray(b.field_id)) {
        b.field_id.forEach(field => {
          if (field && typeof field.price === 'number') totalRevenue += field.price;
        });
      } else if (b.field_id && typeof b.field_id.price === 'number') {
        totalRevenue += b.field_id.price;
      }
    });
    // Total apply: count all partnership requests
    const totalApply = await PartnerRequest.countDocuments();
    // Total venue owner: count all users with role 'owner' (or count unique partnerReq.user_id with status approved)
    const totalVenueOwner = await PartnerRequest.countDocuments({ status: 'approved' });
    // Dummy growths
    const revenueGrowth = 100;
    const visitsGrowth = 80;
    const reservationsGrowth = 10;
    res.json({
      stats: {
        totalRevenue,
        totalApply,
        totalVenueOwner,
        revenueGrowth,
        visitsGrowth,
        reservationsGrowth
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch superadmin stats', error: err.message });
  }
});

// Export the router to be used in the main app
export default router;