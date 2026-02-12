// diva-haus-backend/api/middleware/upload.js
import multer from 'multer';

// Constants for file validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// File filter for image validation
const imageFileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`), false);
  }
};

// Memory storage configuration (stores files as buffers)
const memoryStorage = multer.memoryStorage();

/**
 * Multer instance for general image uploads
 * - Stores files in memory as buffers
 * - Max file size: 10MB
 * - Allowed types: JPEG, PNG, WebP
 */
export const uploadImage = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: imageFileFilter,
});

/**
 * Multer instance for virtual try-on image uploads
 * Uses same configuration as general uploads
 */
export const uploadTryOnImage = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: imageFileFilter,
});

export default {
  uploadImage,
  uploadTryOnImage,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
};
