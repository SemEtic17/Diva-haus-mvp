import Product from '../models/Product.js';
import { runVirtualTryOn } from '../services/virtualTryOn.service.js'; // Import the new service

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

/**
 * Handles virtual try-on requests.
 * Delegates the processing to `virtualTryOn.service.js`.
 *
 * @param {object} req - The request object.
 * @param {object} req.body - The request body.
 * @param {string} req.body.productId - The ID of the product.
 * @param {string} req.body.imageBase64 - The base64 encoded image of the user.
 * @param {object} res - The response object.
 * @returns {Promise<void>}
 *
 * @typedef {object} VirtualTryOnResponseContract
 * @property {boolean} ok - Indicates if the operation was successful.
 * @property {string} [previewUrl] - The URL of the processed image, present on success.
 * @property {string} [error] - A human-readable error message, present on failure.
 * @property {number} [processingTimeMs] - The time taken for processing in milliseconds.
 * @property {string} [modelVersion] - The version of the model used for processing.
 *
 * @returns {Promise<VirtualTryOnResponseContract>} The virtual try-on result.
 */
export async function virtualTryOn(req, res) {
  try {
    const { productId, imageBase64 } = req.body || {};

    // Validate input (can be more robust in a real app)
    if (!productId || !imageBase64) {
      return res.status(400).json({
        ok: false,
        error: 'Missing productId or imageBase64 in request.',
        processingTimeMs: 0,
        modelVersion: 'none'
      });
    }

    // Delegate to the service layer for virtual try-on logic
    const result = await runVirtualTryOn({ productId, imageBase64 });

    if (result.ok) {
      return res.status(200).json(result);
    } else {
      // If the service returns an error, send a 500 with the service's error message
      return res.status(500).json(result);
    }
  } catch (err) {
    console.error('[virtualTryOn] error', err && (err.stack || err.message || err));
    return res.status(500).json({
      ok: false,
      error: 'Server error during virtual try-on processing.',
      processingTimeMs: 0,
      modelVersion: 'none'
    });
  }
}

