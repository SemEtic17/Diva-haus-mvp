import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadBodyImage, deleteBodyImage } from '../controllers/userController.js';
import { uploadImage } from '../middleware/upload.js'; // Day 18: Use shared upload middleware

const router = express.Router();

// @route   POST /api/users/upload-body-image
// @access  Private
// Now using shared upload middleware with consistent validation
router.post('/upload-body-image', protect, uploadImage.single('bodyImage'), uploadBodyImage);

// @route   DELETE /api/users/body-image
// @access  Private
router.delete('/body-image', protect, deleteBodyImage);

export default router;
