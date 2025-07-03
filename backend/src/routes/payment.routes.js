import express from 'express';
import midtransClient from 'midtrans-client';
import authorize from '../middlewares/auth.middleware.js';
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY, FRONTEND_URL } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Initialize Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY
});

router.post('/create-transaction', authorize, async (req, res) => {
  try {
    const { gross_amount, items } = req.body;
    const order_id = `TRX-${uuidv4()}`;

    if (!gross_amount || !items) {
        return res.status(400).json({ message: 'Gross amount and items are required.' });
    }

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

export default router;
