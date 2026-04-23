// diva-haus-backend/api/routes/uploadRoutes.js
import express from 'express';
import { uploadTryOnImage } from '../middleware/upload.js';
import { handleTryOnUpload, handleTryOnWithSavedImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/uploads/virtual-tryon
 * @desc    Upload image for virtual try-on processing
 * @access  Private
 * 
 * Expects multipart/form-data with:
 * - image: The user's photo file
 * - productId: The product ID to try on (in form fields)
 */
router.post('/virtual-tryon', protect, uploadTryOnImage.single('image'), handleTryOnUpload);

/**
 * @route   POST /api/uploads/virtual-tryon/saved
 * @desc    Use saved body image from user profile for virtual try-on
 * @access  Private
 * 
 * Expects JSON body with:
 * - productId: The product ID to try on
 */
router.post('/virtual-tryon/saved', protect, handleTryOnWithSavedImage);

export default router;
