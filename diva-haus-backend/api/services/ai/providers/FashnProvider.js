// diva-haus-backend/api/services/ai/providers/FashnProvider.js
// Provider that forwards requests to an external Python micro‑service running
// FASHN VTON v1.5. The service is expected to expose an HTTP API at
// VTON_SERVICE_URL (e.g. http://localhost:8000/vton) which returns a base64
// encoded preview image.

import { AIProviderInterface } from '../interfaces.js';
import storageService from '../../storage.service.js';
import fetch from 'node-fetch';
import Product from '../../models/Product.js';

export class FashnProvider extends AIProviderInterface {
  constructor() {
    super();
    this.name = 'fashn';
    this.version = 'fashn-v1.5';
    this.serviceUrl = process.env.VTON_SERVICE_URL || 'http://localhost:8000/vton';
  }

  getName() {
    return this.name;
  }

  isAvailable() {
    // service URL must be defined; availability check could be enhanced by a
    // quick health/ping request but that would make startup bloated.
    return !!this.serviceUrl;
  }

  /**
   * @param {object} input
   * @returns {Promise<object>} VirtualTryOnResponse
   */
  async processTryOn(input) {
    const { imageBuffer, imageMimeType, originalName, imageUrl, imagePublicId, productId } = input;

    // we need both a person image and a garment image from the product
    if (!productId) {
      return {
        ok: false,
        error: 'productId is required for FASHN provider',
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }

    // ensure we have a URL for the person image; if we only have a buffer,
    // upload it temporarily so the Python service can fetch it.
    let personUrl = imageUrl;
    if (!personUrl && imageBuffer) {
      const tmp = await storageService.uploadTryOnImage({
        buffer: imageBuffer,
        originalname: originalName || 'body-image.png',
        mimetype: imageMimeType || 'application/octet-stream',
      });
      if (!tmp.success) {
        return {
          ok: false,
          error: 'failed to upload temporary person image for FASHN provider',
          processingTimeMs: 0,
          modelVersion: this.version,
        };
      }
      personUrl = tmp.url;
    }

    if (!personUrl) {
      return {
        ok: false,
        error: 'no person image available',
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }

    // look up product to find garment image URL
    let garmentUrl;
    try {
      const prod = await Product.findById(productId).lean();
      garmentUrl = prod?.image;
    } catch (err) {
      console.error('[FashnProvider] error fetching product:', err);
    }
    if (!garmentUrl) {
      return {
        ok: false,
        error: 'unable to determine garment image for product ' + productId,
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }

    // prepare payload for Python service
    const payload = {
      person_image_url: personUrl,
      garment_image_url: garmentUrl,
      category: input.category || 'tops',
    };

    // include optional fields if provided
    if (input.garmentPhotoType) payload.garment_photo_type = input.garmentPhotoType;
    if (input.numSamples) payload.num_samples = input.numSamples;
    if (input.numTimesteps) payload.num_timesteps = input.numTimesteps;
    if (input.guidanceScale) payload.guidance_scale = input.guidanceScale;
    if (typeof input.seed === 'number') payload.seed = input.seed;
    if (typeof input.segmentationFree === 'boolean') payload.segmentation_free = input.segmentationFree;

    try {
      const response = await fetch(this.serviceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 120000, // 2 minutes
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`FASHN service responded ${response.status}: ${text}`);
      }

      const json = await response.json();
      if (!json.ok) {
        return {
          ok: false,
          error: json.error || 'FASHN service reported failure',
          processingTimeMs: json.processingTimeMs || 0,
          modelVersion: json.modelVersion || this.version,
        };
      }

      // the service returns base64 image; decode and upload to storage so we can
      // return a URL that the frontend can fetch.
      const imgBase64 = json.previewBase64;
      const buf = Buffer.from(imgBase64, 'base64');
      const uploadResult = await storageService.upload({
        buffer: buf,
        originalname: 'tryon-result.png',
        mimetype: 'image/png',
      }, 'try-on-results');

      if (!uploadResult.success) {
        console.warn('[FashnProvider] failed to store result image, returning base64 instead');
        return {
          ok: true,
          previewUrl: undefined,
          previewBase64: imgBase64,
          processingTimeMs: json.processingTimeMs,
          modelVersion: json.modelVersion || this.version,
        };
      }

      return {
        ok: true,
        previewUrl: uploadResult.url,
        processingTimeMs: json.processingTimeMs,
        modelVersion: json.modelVersion || this.version,
      };
    } catch (err) {
      console.error('[FashnProvider] error calling service:', err);
      return {
        ok: false,
        error: err.message,
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }
  }
}
