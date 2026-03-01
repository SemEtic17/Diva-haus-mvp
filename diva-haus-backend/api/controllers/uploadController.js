// diva-haus-backend/api/controllers/uploadController.js
import { runVirtualTryOn } from '../services/virtualTryOn.service.js';
import storageService from '../services/storage.service.js'; // Day 19: Persist uploaded images
import User from '../models/User.js';

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

    // Day 19: Persist the uploaded image to storage
    const uploadResult = await storageService.uploadTryOnImage(file);
    
    if (!uploadResult.success) {
      return res.status(500).json({
        ok: false,
        error: uploadResult.error || 'Failed to save uploaded image',
        processingTimeMs: 0,
        modelVersion: 'none',
      });
    }

    // Pass file buffer and storage URL to the service
    const result = await runVirtualTryOn({
      imageBuffer: file.buffer,
      imageMimeType: file.mimetype,
      originalName: file.originalname,
      imageUrl: uploadResult.url, // Day 19: Include stored image URL
      imagePublicId: uploadResult.publicId,
      productId,
    });

    // provider failures are returned in JSON, so simply send them back
    // with a 200 status; the client helper will interpret `ok`.
    return res.status(200).json(result);
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

/**
 * Handles virtual try-on using the user's saved body image from their profile.
 * 
 * @param {object} req - Express request object
 * @param {object} req.user - Authenticated user (set by protect middleware)
 * @param {object} req.body - Request body
 * @param {string} req.body.productId - The product ID to try on
 * @param {object} res - Express response object
 * @returns {Promise<VirtualTryOnResponseContract>}
 */
export async function handleTryOnWithSavedImage(req, res) {
  try {
    const { productId } = req.body || {};
    const user = req.user; // Set by protect middleware

    // Validate required fields
    if (!productId) {
      return res.status(400).json({
        ok: false,
        error: 'Missing productId in request.',
        processingTimeMs: 0,
        modelVersion: 'none',
      });
    }

    // Check if user has a saved body image
    if (!user.bodyImage) {
      return res.status(400).json({
        ok: false,
        error: 'No body image found in your profile. Please upload a body image first.',
        processingTimeMs: 0,
        modelVersion: 'none',
      });
    }

    // Use the saved body image URL for virtual try-on
    const result = await runVirtualTryOn({
      imageUrl: user.bodyImage,
      imagePublicId: user.bodyImagePublicId,
      productId,
    });

    // always send 200; error details are returned in payload
    return res.status(200).json(result);
  } catch (err) {
    console.error('[handleTryOnWithSavedImage] error:', err?.stack || err?.message || err);

    return res.status(500).json({
      ok: false,
      error: 'Server error during virtual try-on processing.',
      processingTimeMs: 0,
      modelVersion: 'none',
    });
  }
}
