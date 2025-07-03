import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `field-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

export const upload = multer({ storage });