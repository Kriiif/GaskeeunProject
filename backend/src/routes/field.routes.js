import express from 'express';
import { upload } from '../middlewares/upload.middleware.js';
import authorize from '../middlewares/auth.middleware.js';
import Field from '../models/field.model.js';

const router = express.Router();

// Tambah field baru
router.post('/', upload.single('image'), authorize, async (req, res) => {
  try {
    const { name, category, price, desc, open_hour, close_hour } = req.body;

    if (!name || !category || !price || !desc || !open_hour || !close_hour) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
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
      name,
      category,
      price: parseInt(price),
      desc,
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
