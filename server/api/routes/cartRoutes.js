import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addToCart).get(protect, getCart);
router.route('/:productId').put(protect, updateCartItem).delete(protect, removeFromCart);

export default router;
