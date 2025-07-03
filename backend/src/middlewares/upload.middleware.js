import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    let prefix = 'file';
    // Tentukan prefix sesuai fieldname
    if (file.fieldname === 'fotoSuratTanah') prefix = 'surattanah';
    else if (file.fieldname === 'fotoKTP') prefix = 'ktp';
    else if (file.fieldname === 'fotoVenue') prefix = 'venue';
    else if (file.fieldname === 'image') prefix = 'field'; // untuk upload gambar field lapangan
    // Bisa ditambah field lain jika perlu
    const filename = `${prefix}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

export const upload = multer({ storage });