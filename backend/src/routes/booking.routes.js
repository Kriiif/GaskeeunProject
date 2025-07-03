import express from 'express';
import { getAllBookings, getUserHistory } from '../controllers/booking.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getAllBookings);
router.get('/history', authorize, getUserHistory);

export default router;
