import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// Mock Virtual Try-On Endpoint
router.post('/virtual-tryon', (req, res) => {
  const { productId, imageBase64 } = req.body;

  if (!productId || !imageBase64) {
    return res.status(400).json({ ok: false, message: 'Missing productId or imageBase64' });
  }

  // Do NOT do any real processing.
  // Respond with:
  res.json({
    ok: true,
    message: "Mock try-on complete",
    previewUrl: "https://picsum.photos/seed/virtualtryon/400/400",
    timestamp: new Date().toISOString()
  });
});

export default router;
