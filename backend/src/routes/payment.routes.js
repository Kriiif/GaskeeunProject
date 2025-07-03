import express from 'express';
import midtransClient from 'midtrans-client';
import authorize from '../middlewares/auth.middleware.js';
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY, FRONTEND_URL } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';
import Booking from '../models/booking.model.js';
import Field from '../models/field.model.js'; // Import Field model
import Payment from '../models/payment.model.js';

const router = express.Router();

// Initialize Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY
});

router.post('/create-transaction', authorize, async (req, res) => {
  try {
    const { items, venue_id, booking_details } = req.body;
    const order_id = `TRX-${uuidv4()}`;

    if (!items || !venue_id || !booking_details) {
        return res.status(400).json({ message: 'Items, venue_id, and booking_details are required.' });
    }

    // Recalculate gross_amount on the backend for security and accuracy
    let calculated_gross_amount = 0;
    const sanitized_items = await Promise.all(items.map(async (item) => {
        const field = await Field.findById(item.id);
        if (!field) {
            throw new Error(`Field with id ${item.id} not found`);
        }
        const item_price = field.price;
        calculated_gross_amount += item_price * item.quantity;
        
        // Truncate item name to meet Midtrans requirements
        const sanitized_name = item.name.length > 50 ? item.name.substring(0, 47) + '...' : item.name;

        return {
            id: String(item.id).substring(0, 50), // Ensure ID is a string and truncated
            price: item_price,
            quantity: item.quantity,
            name: sanitized_name,
        };
    }));

    // Create a single booking with multiple fields
    const newBooking = new Booking({
        order_id: order_id,
        user_id: req.user._id,
        venue_id: venue_id,
        field_id: booking_details.map(detail => detail.field_id),
        booking_date: booking_details[0].date, // Assuming all bookings in a transaction are for the same date
        booking_time: booking_details.map(detail => detail.time).join(', '), // Combine times
        total_price: calculated_gross_amount, // Use the securely calculated amount
        status: 'PENDING'
    });

    await newBooking.save();

    const parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: calculated_gross_amount, // Use calculated amount
      },
      item_details: sanitized_items, // Use sanitized items
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
    const paymentType = statusResponse.payment_type;
    const settlementTime = statusResponse.settlement_time;
    const grossAmount = statusResponse.gross_amount;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    const booking = await Booking.findOne({ order_id: orderId });
    if (!booking) {
      console.error(`Booking with order_id ${orderId} not found.`);
      // We don't want to send a 500 if the booking isn't found, 
      // but we should log it. Midtrans might send notifications for 
      // transactions that don't have a corresponding booking in our system.
      return res.status(200).send('OK');
    }

    let bookingStatus;
    let paymentStatus = 'PENDING';

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'accept') {
        bookingStatus = 'PAID';
        paymentStatus = 'PAID';
      }
    } else if (transactionStatus == 'settlement') {
      bookingStatus = 'PAID';
      paymentStatus = 'PAID';
    } else if (transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire') {
      bookingStatus = 'CANCELLED';
      paymentStatus = 'FAILED';
    } else if (transactionStatus == 'pending') {
      bookingStatus = 'PENDING';
      paymentStatus = 'PENDING';
    }

    if (bookingStatus) {
        booking.status = bookingStatus;

        if (paymentStatus === 'PAID') {
            const newPayment = new Payment({
                booking_id: booking._id,
                amount: grossAmount,
                method: paymentType,
                status: 'PAID',
                paid_at: settlementTime || new Date()
            });
            const savedPayment = await newPayment.save();
            booking.payment_id = savedPayment._id;
        }

        await booking.save();
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
