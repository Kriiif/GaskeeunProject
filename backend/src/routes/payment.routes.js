import express from 'express';
import midtransClient from 'midtrans-client';
import authorize from '../middlewares/auth.middleware.js';
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY, FRONTEND_URL } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
import Booking from '../models/booking.model.js';

const router = express.Router();

// Initialize Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY
});

router.post('/create-transaction', authorize, async (req, res) => {
  try {
    const { gross_amount, items, venue_id, booking_details } = req.body;
    const order_id = `TRX-${uuidv4()}`;

    if (!gross_amount || !items || !venue_id || !booking_details) {
        return res.status(400).json({ message: 'Gross amount, items, venue_id, and booking_details are required.' });
    }

    // Create booking records
    const bookingPromises = booking_details.map(detail => {
      const newBooking = new Booking({
        order_id: order_id,
        user_id: req.user._id,
        venue_id: venue_id,
        field_id: detail.field_id,
        booking_date: detail.date,
        booking_time: detail.time,
        status: 'PENDING'
      });
      return newBooking.save();
    });

    await Promise.all(bookingPromises);

    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },
      item_details: items,
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
      },
      callbacks: {
        finish: `${FRONTEND_URL}/order/status?order_id=${order_id}`
      }
    };

    const transaction = await snap.createTransaction(parameter);
    const transactionToken = transaction.token;

    res.status(200).json({ token: transactionToken });

  } catch (error) {
    console.error('Midtrans Error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/notification-handler', async (req, res) => {
  try {
    const notificationJson = req.body;

    const statusResponse = await snap.transaction.notification(notificationJson);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    let bookingStatus;
    if (transactionStatus == 'capture') {
      if (fraudStatus == 'accept') {
        bookingStatus = 'CONFIRMED';
      }
    } else if (transactionStatus == 'settlement') {
      bookingStatus = 'CONFIRMED';
    } else if (transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire') {
      bookingStatus = 'CANCELLED';
    } else if (transactionStatus == 'pending') {
      bookingStatus = 'PENDING';
    }

    if (bookingStatus) {
      await Booking.updateMany({ order_id: orderId }, { status: bookingStatus });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Midtrans notification handler error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/transaction-status/:order_id', authorize, async (req, res) => {
  try {
    const { order_id } = req.params;

    const statusResponse = await snap.transaction.status(order_id);
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction status check for Order ID: ${order_id}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    let bookingStatus;
    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
      if (fraudStatus == 'accept') {
        bookingStatus = 'CONFIRMED';
      }
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      bookingStatus = 'CANCELLED';
    } else if (transactionStatus == 'pending') {
      bookingStatus = 'PENDING';
    }

    if (bookingStatus) {
      await Booking.updateMany({ order_id: order_id }, { status: bookingStatus });
    }

    res.status(200).json({ transaction_status: transactionStatus, booking_status: bookingStatus });

  } catch (error) {
    console.error('Check transaction status error:', error);
    // Don't send a 500 to the client if the transaction is simply not found
    if (error.message.includes('Transaction doesn\'t exist')) {
        return res.status(404).json({ message: 'Transaction not found.' });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
