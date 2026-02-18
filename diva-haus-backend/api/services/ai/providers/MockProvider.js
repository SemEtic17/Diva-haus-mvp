// diva-haus-backend/api/services/ai/providers/MockProvider.js
// Day 21: Mock AI Provider Implementation

import { AIProviderInterface } from '../interfaces.js';

/**
 * Mock provider for virtual try-on
 * Returns placeholder images for development/testing
 */
export class MockProvider extends AIProviderInterface {
  constructor() {
    super();
    this.name = 'mock';
    this.version = 'mock-v1';
  }

  /**
   * @returns {string} Provider name
   */
  getName() {
    return this.name;
  }

  /**
   * Mock provider is always available (no external dependencies)
   * @returns {boolean}
   */
  isAvailable() {
    return true;
  }

  /**
   * Process virtual try-on request (mock implementation)
   * @param {object} input - VirtualTryOnInput
   * @returns {Promise<VirtualTryOnResponse>}
   */
  async processTryOn(input) {
    const { imageBuffer, imageMimeType, originalName, imageUrl, imagePublicId, imageBase64, productId } = input;

    // Simulate network delay (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Validate input
    const hasImage = Boolean(imageBuffer || imageBase64 || imageUrl);
    if (!hasImage || !productId) {
      return {
        ok: false,
        error: 'Missing image or productId for virtual try-on.',
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }

    // Log input info for debugging
    if (imageBuffer) {
      console.log(`[MockProvider] Processing file: ${originalName}, type: ${imageMimeType}, size: ${imageBuffer.length} bytes`);
    }
    if (imageUrl) {
      console.log(`[MockProvider] Using stored image URL: ${imageUrl}`);
    }
    console.log(`[MockProvider] Product ID: ${productId}`);

    // Simulate processing time (1-3 seconds)
    const mockProcessingTime = Math.floor(Math.random() * 2000) + 1000;

    // Return placeholder image URL
    const mockPreviewUrl = `https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/25813096/2023/11/8/efb3433d-7436-4897-8331-222641f466a01699447608033FloralGownDress1.jpg`;

    return {
      ok: true,
      previewUrl: mockPreviewUrl,
      processingTimeMs: mockProcessingTime,
      modelVersion: this.version,
    };
  }
}
