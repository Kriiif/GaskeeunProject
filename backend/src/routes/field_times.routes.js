import express from 'express';
import FieldTimes from '../models/field_times.model.js';
import Booking from '../models/booking.model.js';

const router = express.Router();

// GET all field_times for a specific field
// Optionally filter out slots that are already booked (status CONFIRMED/COMPLETED)
router.get('/field/:fieldId', async (req, res) => {
  try {
    const { fieldId } = req.params;
    // Get all field_times for this field
    const fieldTimes = await FieldTimes.find({ field_id: fieldId });

    // Get all bookings for this field with status CONFIRMED or COMPLETED
    const bookings = await Booking.find({
      field_id: fieldId,
      status: { $in: ['CONFIRMED', 'COMPLETED'] }
    });
    // Build a set of booked time slots (by start_time ISO string)
    const bookedTimes = new Set(
      bookings.map(b => {
        // Try to parse booking_date and booking_time to ISO string
        // booking_date: 'YYYY-MM-DD', booking_time: 'HH:mm'
        if (!b.booking_date || !b.booking_time) return null;
        return `${b.booking_date}T${b.booking_time}`;
      }).filter(Boolean)
    );
    // Filter out field_times that are already booked
    const availableFieldTimes = fieldTimes.filter(ft => {
      if (!ft.start_time) return true;
      // Convert ft.start_time to 'YYYY-MM-DDTHH:mm' (local time)
      const d = new Date(ft.start_time.getTime() - (ft.start_time.getTimezoneOffset() * 60000));
      const iso = d.toISOString().slice(0,16); // 'YYYY-MM-DDTHH:mm'
      return !bookedTimes.has(iso);
    });
    res.json({ success: true, data: availableFieldTimes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch field times', error: error.message });
  }
});

// (Optional) GET all field_times
router.get('/', async (req, res) => {
  try {
    const fieldTimes = await FieldTimes.find();
    res.json({ success: true, data: fieldTimes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch field times', error: error.message });
  }
});

export default router;
