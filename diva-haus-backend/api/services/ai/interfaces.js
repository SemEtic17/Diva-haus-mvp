// diva-haus-backend/api/services/ai/interfaces.js
// Day 21: AI Service Interface Definitions

/**
 * Input parameters for virtual try-on processing
 * @typedef {object} VirtualTryOnInput
 * @property {Buffer} [imageBuffer] - Raw image file buffer (if uploading new image)
 * @property {string} [imageMimeType] - MIME type of the image (e.g., 'image/jpeg')
 * @property {string} [originalName] - Original filename
 * @property {string} [imageUrl] - URL to the stored image (preferred for saved images)
 * @property {string} [imagePublicId] - Storage provider's public ID for the image
 * @property {string} [imageBase64] - Base64 encoded image (legacy, deprecated)
 * @property {string} productId - MongoDB ObjectId of the product to try on
 */

/**
 * Response from virtual try-on processing
 * @typedef {object} VirtualTryOnResponse
 * @property {boolean} ok - Indicates if the operation was successful
 * @property {string} [previewUrl] - URL to the processed/result image (present when ok=true)
 * @property {string} [error] - Human-readable error message (present when ok=false)
 * @property {number} [processingTimeMs] - Time taken for processing in milliseconds
 * @property {string} [modelVersion] - Version identifier of the AI model used
 */

/**
 * Abstract interface for AI try-on providers
 * All AI providers must implement this interface
 */
export class AIProviderInterface {
  /**
   * Process a virtual try-on request
   * @param {VirtualTryOnInput} input - Input parameters
   * @returns {Promise<VirtualTryOnResponse>} Processing result
   * @throws {Error} If provider is not properly configured
   */
  async processTryOn(input) {
    throw new Error('processTryOn must be implemented by provider');
  }

  /**
   * Get the provider name/identifier
   * @returns {string} Provider name (e.g., 'mock', 'replicate', 'custom')
   */
  getName() {
    throw new Error('getName must be implemented by provider');
  }

  /**
   * Check if the provider is available/configured
   * @returns {boolean} True if provider can be used
   */
  isAvailable() {
    throw new Error('isAvailable must be implemented by provider');
  }
}
