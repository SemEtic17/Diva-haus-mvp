// diva-haus-backend/api/routes/uploadRoutes.js
import express from 'express';
import { uploadTryOnImage } from '../middleware/upload.js';
import { handleTryOnUpload } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/uploads/virtual-tryon
 * @desc    Upload image for virtual try-on processing
 * @access  Public (can add auth middleware if needed)
 * 
 * Expects multipart/form-data with:
 * - image: The user's photo file
 * - productId: The product ID to try on (in form fields)
 */
// Require authentication for try-on uploads to ensure uploads are tied to a user
router.post('/virtual-tryon', protect, uploadTryOnImage.single('image'), handleTryOnUpload);

export default router;
