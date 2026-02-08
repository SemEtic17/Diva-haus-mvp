import Product from '../models/Product.js';

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// exportable controller function for virtual try-on (mock)
export async function virtualTryOn(req, res) {
  try {
    const { productId, imageBase64 } = req.body || {};
    if (!productId || !imageBase64) {
      return res.status(400).json({ ok: false, message: 'Missing productId or imageBase64' });
    }

    // Important: do NOT process image. This is a mock endpoint for Day 14.
    return res.json({
      ok: true,
      message: 'Mock try-on complete',
      previewUrl: 'https://picsum.photos/seed/virtualtryon/400/400',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[virtualTryOn] error', err && (err.stack || err.message || err));
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
}

