// diva-haus-backend/api/services/virtualTryOn.service.js

/**
 * @typedef {object} VirtualTryOnResponse
 * @property {boolean} ok
 * @property {string} [previewUrl]
 * @property {string} [error]
 * @property {number} [processingTimeMs]
 * @property {string} [modelVersion]
 */

/**
 * Simulates a virtual try-on process (mock).
 *
 * @param {object} params
 * @param {Buffer} [params.imageBuffer]
 * @param {string} [params.imageMimeType]
 * @param {string} [params.originalName]
 * @param {string} [params.imageUrl] - Day 19: Stored image URL
 * @param {string} [params.imagePublicId] - Day 19: Storage public ID for deletion
 * @param {string} [params.imageBase64] - legacy
 * @param {string} params.productId
 * @returns {Promise<VirtualTryOnResponse>}
 */
export async function runVirtualTryOn({ imageBuffer, imageMimeType, originalName, imageUrl, imagePublicId, imageBase64, productId }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const hasImage = Boolean(imageBuffer || imageBase64 || imageUrl);

  if (!hasImage || !productId) {
    return {
      ok: false,
      error: 'Missing image or productId for virtual try-on.',
      processingTimeMs: 0,
      modelVersion: 'mock-v1',
    };
  }

  // Log upload info for debugging (in production, send to AI service)
  if (imageBuffer) {
    console.log(`[VirtualTryOn] Processing file: ${originalName}, type: ${imageMimeType}, size: ${imageBuffer.length} bytes`);
  }
  if (imageUrl) {
    console.log(`[VirtualTryOn] Stored image URL: ${imageUrl}`);
  }

  const mockProcessingTime = Math.floor(Math.random() * 2000) + 1000; // 1-3s
  // const mockPreviewUrl = `https://picsum.photos/seed/virtualtryon/${Math.floor(Math.random() * 1000)}/400/400`;
  const mockPreviewUrl = `https://picsum.photos/seed/virtualtryon/400/400`;

  return {
    ok: true,
    previewUrl: mockPreviewUrl,
    processingTimeMs: mockProcessingTime,
    modelVersion: 'mock-v1',
  };
}
