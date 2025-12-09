import express from 'express';
import { registerUser, loginUser, getAuthStatus, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import protect middleware

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/status', protect, getAuthStatus); // New route
router.post('/logout', logoutUser); // New route

export default router;
