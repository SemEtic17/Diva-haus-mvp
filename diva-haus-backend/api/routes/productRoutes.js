import express from 'express';
import { getProducts, getProductById, virtualTryOn } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/virtual-tryon', virtualTryOn);

export default router;
