import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  uploadBodyImage,
  deleteBodyImage,
  getUsers,
  deleteUser,
  updateUser,
} from '../controllers/userController.js';
import { uploadImage } from '../middleware/upload.js'; // Day 18: Use shared upload middleware

const router = express.Router();

// @route   POST /api/users/upload-body-image
// @access  Private
router.post('/upload-body-image', protect, uploadImage.single('bodyImage'), uploadBodyImage);

// @route   DELETE /api/users/body-image
// @access  Private
router.delete('/body-image', protect, deleteBodyImage);

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

export default router;
