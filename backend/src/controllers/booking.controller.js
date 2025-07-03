import Booking from '../models/booking.model.js';
import Review from '../models/review.model.js';

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate({
                path: 'user_id',
                select: 'name'
            })
            .populate({
                path: 'venue_id',
                select: 'name'
            })
            .populate({
                path: 'field_id',
                select: 'name price'
            });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserHistory = async (req, res) => {
    try {
        const bookings = await Booking.find({ user_id: req.user._id })
            .populate({
                path: 'venue_id',
                populate: {
                    path: 'partner_req_id',
                    select: 'namaVenue lokasiVenue'
                }
            })
            .populate({
                path: 'field_id',
                select: 'name price'
            })
            .populate({
                path: 'payment_id',
                select: 'method'
            })
            .sort({ created_at: -1 })
            .lean();

        const historyWithRatedStatus = await Promise.all(bookings.map(async (booking) => {
            // Find the review associated with the specific booking_id
            const review = await Review.findOne({ booking_id: booking._id });
            
            return {
                ...booking,
                hasRated: !!review,
                userRating: review ? review.rating : null,
                userComment: review ? review.comment : null
            };
        }));

        res.status(200).json(historyWithRatedStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
