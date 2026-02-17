// diva-haus-backend/api/services/virtualTryOn.service.js
// Day 21: Refactored to use AI provider abstraction

import { AIProviderFactory } from './ai/AIProviderFactory.js';

/**
 * @typedef {object} VirtualTryOnResponse
 * @property {boolean} ok
 * @property {string} [previewUrl]
 * @property {string} [error]
 * @property {number} [processingTimeMs]
 * @property {string} [modelVersion]
 */

// Cache provider instance to avoid recreating it on every call
let cachedProvider = null;

/**
 * Get or create the AI provider instance
 * @returns {AIProviderInterface} Provider instance
 */
function getProvider() {
  if (!cachedProvider) {
    cachedProvider = AIProviderFactory.getProvider();
    console.log(`[VirtualTryOnService] Initialized provider: ${cachedProvider.getName()}`);
  }
  return cachedProvider;
}

/**
 * Process a virtual try-on request using the configured AI provider
 * 
 * This function maintains backward compatibility with existing code while
 * delegating to the abstracted AI provider system.
 *
 * @param {object} params - Input parameters
 * @param {Buffer} [params.imageBuffer] - Raw image file buffer
 * @param {string} [params.imageMimeType] - MIME type of the image
 * @param {string} [params.originalName] - Original filename
 * @param {string} [params.imageUrl] - URL to stored image (preferred)
 * @param {string} [params.imagePublicId] - Storage provider's public ID
 * @param {string} [params.imageBase64] - Base64 encoded image (legacy, deprecated)
 * @param {string} params.productId - MongoDB ObjectId of the product
 * @returns {Promise<VirtualTryOnResponse>} Processing result
 */
export async function runVirtualTryOn({ imageBuffer, imageMimeType, originalName, imageUrl, imagePublicId, imageBase64, productId }) {
  try {
    const provider = getProvider();

    // Validate provider availability
    if (!provider.isAvailable()) {
      return {
        ok: false,
        error: `AI provider "${provider.getName()}" is not available. Please check configuration.`,
        processingTimeMs: 0,
        modelVersion: 'none',
      };
    }

    // Delegate to provider
    const result = await provider.processTryOn({
      imageBuffer,
      imageMimeType,
      originalName,
      imageUrl,
      imagePublicId,
      imageBase64,
      productId,
    });

    return result;
  } catch (error) {
    console.error('[VirtualTryOnService] Error processing try-on:', error);
    return {
      ok: false,
      error: error.message || 'An error occurred during virtual try-on processing.',
      processingTimeMs: 0,
      modelVersion: 'none',
    };
  }
}
