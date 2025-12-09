import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { uploadBodyImage } from '../controllers/userController.js';

const router = express.Router();

// Configure multer for file storage
// For a real application, you'd use a storage engine that saves to cloud storage
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });

// @route   POST /api/users/upload-body-image
// @access  Private
router.post('/upload-body-image', protect, upload.single('bodyImage'), uploadBodyImage);


export default router;
