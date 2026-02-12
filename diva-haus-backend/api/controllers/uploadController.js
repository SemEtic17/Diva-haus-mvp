// diva-haus-backend/api/controllers/uploadController.js
import { runVirtualTryOn } from '../services/virtualTryOn.service.js';

/**
 * @typedef {object} VirtualTryOnResponseContract
 * @property {boolean} ok - Indicates if the operation was successful.
 * @property {string} [previewUrl] - The URL of the processed image, present on success.
 * @property {string} [error] - A human-readable error message, present on failure.
 * @property {number} [processingTimeMs] - The time taken for processing in milliseconds.
 * @property {string} [modelVersion] - The version of the model used for processing.
 */

/**
 * Handles virtual try-on image uploads using multipart/form-data.
 * 
 * @param {object} req - Express request object
 * @param {object} req.file - Multer file object (buffer, mimetype, originalname, size)
 * @param {object} req.body - Form fields
 * @param {string} req.body.productId - The product ID to try on
 * @param {object} res - Express response object
 * @returns {Promise<VirtualTryOnResponseContract>}
 */
export async function handleTryOnUpload(req, res) {
  try {
    const { productId } = req.body || {};
    const file = req.file;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({
        ok: false,
        error: 'Missing productId in request.',
        processingTimeMs: 0,
        modelVersion: 'none',
      });
    }

    if (!file) {
      return res.status(400).json({
        ok: false,
        error: 'No image file uploaded.',
        processingTimeMs: 0,
        modelVersion: 'none',
      });
    }

    // Pass file buffer to the service (instead of base64)
    const result = await runVirtualTryOn({
      imageBuffer: file.buffer,
      imageMimeType: file.mimetype,
      originalName: file.originalname,
      productId,
    });

    if (result.ok) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (err) {
    console.error('[handleTryOnUpload] error:', err?.stack || err?.message || err);
    
    // Handle multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        ok: false,
        error: 'File size exceeds the 10MB limit.',
        processingTimeMs: 0,
        modelVersion: 'none',
      });
    }

    return res.status(500).json({
      ok: false,
      error: 'Server error during virtual try-on processing.',
      processingTimeMs: 0,
      modelVersion: 'none',
    });
  }
}
