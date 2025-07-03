import express from 'express';
import authorize from '../middlewares/auth.middleware.js';
import Cart from '../models/cart.model.js';

const router = express.Router();

// Get user's cart
router.get('/', authorize, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.fieldId');
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Add item to cart
router.post('/add', authorize, async (req, res) => {
  const { fieldId, date, time, numericPrice, fieldName, fieldImage, venueId } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(item => 
      item.fieldId.toString() === fieldId && item.date === date && item.time === time
    );

    if (existingItemIndex > -1) {
      // Item already in cart, maybe update quantity in future or just ignore
      return res.status(400).json({ success: false, message: 'Item already in cart' });
    } else {
      cart.items.push({ fieldId, date, time, numericPrice, fieldName, fieldImage, venueId });
    }

    await cart.save();
    // Repopulate the items to get all details before sending back
    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate('items.fieldId');
    res.status(201).json({ success: true, data: populatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Remove item from cart
router.post('/remove', authorize, async (req, res) => {
    const { fieldId, date, time } = req.body;

    try {
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const initialCount = cart.items.length;
        cart.items = cart.items.filter(item => 
            !(item.fieldId.toString() === fieldId && item.date === date && item.time === time)
        );

        if (cart.items.length === initialCount) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        await cart.save();
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});

// Merge local cart with DB cart
router.post('/merge', authorize, async (req, res) => {
    const { localCartItems } = req.body;

    try {
        let dbCart = await Cart.findOne({ userId: req.user._id });

        if (!dbCart) {
            dbCart = new Cart({ userId: req.user._id, items: [] });
        }

        localCartItems.forEach(localItem => {
            const isDuplicate = dbCart.items.some(dbItem => 
                dbItem.fieldId.toString() === localItem.fieldId && 
                dbItem.date === localItem.date && 
                dbItem.time === localItem.time
            );

            if (!isDuplicate) {
                dbCart.items.push(localItem);
            }
        });

        await dbCart.save();
        res.status(200).json({ success: true, data: dbCart });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
});


export default router;
