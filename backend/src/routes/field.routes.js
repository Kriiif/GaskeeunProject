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
    const { source } = req.query; // Tambahkan untuk memeriksa sumber permintaan

    const filter = { venue_id };
    // Jika permintaan bukan dari dasbor pemilik, hanya tampilkan lapangan yang aktif
    if (source !== 'owner_dashboard') {
      filter.is_active = true;
    }

    const fields = await Field.find(filter)
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

// Update field by ID
router.put('/:id', upload.single('image'), authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({ message: 'Lapangan tidak ditemukan' });
    }

    // Pastikan user yang mengedit adalah pemilik lapangan
    if (field.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Anda tidak memiliki izin untuk mengedit lapangan ini' });
    }

    // Handle status update from frontend
    if (updateData.status) {
      field.is_active = updateData.status === 'Online';
      delete updateData.status; // Prevent status from being directly assigned
    }

    // Update other field properties
    Object.assign(field, updateData);

    // Handle image update
    if (req.file) {
      field.image_url = `/uploads/${req.file.filename}`;
    }

    const updatedField = await field.save();

    res.status(200).json({
      success: true,
      message: 'Lapangan berhasil diperbarui',
      data: updatedField
    });

  } catch (err) {
    console.error('Error updating field:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan di server saat memperbarui data lapangan' 
    });
  }
});

// Delete field by ID
router.delete('/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const field = await Field.findById(id);
    if (!field) {
      return res.status(404).json({ message: 'Lapangan tidak ditemukan' });
    }
    // Pastikan user yang menghapus adalah pemilik lapangan
    if (field.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Anda tidak memiliki izin untuk menghapus lapangan ini' });
    }
    await Field.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Lapangan berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting field:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan di server saat menghapus data lapangan' });
  }
});

export default router;
