import Booking from '../models/booking.model.js';
import Venue from '../models/venue.model.js';
import User from '../models/user.model.js';
import PartnerRequest from '../models/partner_req.model.js';

export const getOwnerStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const partnerRequests = await PartnerRequest.find({ user_id: userId });
        if (!partnerRequests.length) {
            return res.status(200).json({
                totalRevenue: 0,
                totalOrders: 0,
                totalCustomers: 0,
            });
        }

        const partnerReqIds = partnerRequests.map(pr => pr._id);

        const venues = await Venue.find({ partner_req_id: { $in: partnerReqIds } });
        if (!venues.length) {
            return res.status(200).json({
                totalRevenue: 0,
                totalOrders: 0,
                totalCustomers: 0,
            });
        }

        const venueIds = venues.map(v => v._id);

        const bookings = await Booking.find({ venue_id: { $in: venueIds } }).populate('user_id');

        const totalRevenue = bookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((acc, b) => acc + b.total_price, 0);

        const totalOrders = bookings.length;

        const customerIds = [...new Set(bookings.map(b => b.user_id.toString()))];
        const totalCustomers = customerIds.length;

        res.status(200).json({
            totalRevenue,
            totalOrders,
            totalCustomers,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOwnerRecentOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const partnerRequests = await PartnerRequest.find({ user_id: userId });
        if (!partnerRequests.length) {
            return res.status(200).json([]);
        }

        const partnerReqIds = partnerRequests.map(pr => pr._id);

        const venues = await Venue.find({ partner_req_id: { $in: partnerReqIds } });
        if (!venues.length) {
            return res.status(200).json([]);
        }

        const venueIds = venues.map(v => v._id);

        const recentOrders = await Booking.find({ venue_id: { $in: venueIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user_id', 'name');

        res.status(200).json(recentOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
