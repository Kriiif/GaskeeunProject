import express from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import authorize from '../middlewares/auth.middleware.js';
import Field from '../models/field.model.js';

const router = express.Router();

// Get all fields
router.get('/', async (req, res) => {
  try {
    const fields = await Field.find({}).populate('owner_id', 'name');
    res.status(200).json(fields);
  } catch (err) {
    console.error('Error fetching fields:', err);
    res.status(500).json({ message: 'Terjadi kesalahan di server saat mengambil data lapangan' });
  }
});

// Get fields by venue_id
router.get('/venue/:venue_id', async (req, res) => {
  try {
    const { venue_id } = req.params;
    const fields = await Field.find({ venue_id, is_active: true })
      .populate('owner_id', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: fields
    });
  } catch (err) {
    console.error('Error fetching fields by venue:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan di server saat mengambil data lapangan' 
    });
  }
});

// Tambah field baru
router.post('/', upload.single('image'), authorize, async (req, res) => {
  try {
    const { name, category, price, desc, open_hour, close_hour, location, venue_id } = req.body;

    if (!name || !category || !price || !desc || !open_hour || !close_hour || !location || !venue_id) {
      return res.status(400).json({ message: 'Semua field wajib diisi (termasuk venue_id)' });
    }

    const parsedPrice = parseInt(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: 'Harga harus berupa angka' });
    }

    console.log('REQ BODY:', req.body);
    console.log('REQ FILE:', req.file);
    console.log('REQ USER:', req.user);

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const newField = new Field({
      venue_id: venue_id, // venue_id sudah divalidasi
      name,
      category,
      price: parsedPrice,
      desc,
      location,
      open_hour,
      close_hour,
      image_url,
      owner_id: req.user._id
    });

    await newField.save();

    res.status(201).json({
      message: 'Field berhasil ditambahkan',
      field: newField
    });
  } catch (err) {
    console.error('Error saat tambah field:', err);
    res.status(500).json({ message: 'Terjadi kesalahan di server' });
  }
});

export default router;
