// diva-haus-backend/api/services/ai/providers/PixazoProvider.js
// Provider implementing the Pixazo Fashn Virtual Try-On API.  Pixazo
// exposes a simple REST endpoint that queues a request and then allows you to
// poll for the result.  This class wraps the two‑step process and returns a
// result that matches the VirtualTryOnResponse contract used throughout the
// application.

import { AIProviderInterface } from '../interfaces.js';
import storageService from '../../storage.service.js';
import fetch from 'node-fetch';
import Product from '../../../models/Product.js';

export class PixazoProvider extends AIProviderInterface {
  constructor() {
    super();
    this.name = 'pixazo';
    this.apiKey = process.env.PIXAZO_API_KEY;
    // the base gateway URL; change if Pixazo ever publishes a new version
    this.baseUrl = process.env.PIXAZO_BASE_URL || 'https://gateway.pixazo.ai/fashn-virtual-try-on/v1';
    this.requestEndpoint = `${this.baseUrl}/fashn-virtual-try-on-request`;
    this.resultEndpoint = `${this.baseUrl}/fashn-virtual-try-on-request-result`;
    this.version = 'pixazo-fashn-v1.6';
  }

  getName() {
    return this.name;
  }

  isAvailable() {
    return !!this.apiKey;
  }

  /**
   * @param {object} input
   * @returns {Promise<object>} VirtualTryOnResponse
   */
  async processTryOn(input) {
    const { imageUrl, productId } = input;

    if (!imageUrl || !productId) {
      return {
        ok: false,
        error: 'person image URL and productId are required for Pixazo provider',
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }

    // obtain garment image URL from product record
    let garmentUrl;
    try {
      const prod = await Product.findById(productId).lean();
      garmentUrl = prod?.image;
    } catch (err) {
      console.error('[PixazoProvider] error fetching product', err);
    }
    if (!garmentUrl) {
      return {
        ok: false,
        error: 'unable to determine garment image for product ' + productId,
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }

    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Ocp-Apim-Subscription-Key': this.apiKey,
    };

    const payload = {
      model_image: imageUrl,
      garment_image: garmentUrl,
      category: 'auto',
      mode: 'balanced',
      garment_photo_type: 'auto',
      moderation_level: 'permissive',
      num_samples: 1,
      segmentation_free: true,
      output_format: 'png',
    };

    const start = Date.now();

    try {
      const resp = await fetch(this.requestEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        timeout: 120000,
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Pixazo request error ${resp.status}: ${txt}`);
      }
      const json = await resp.json();
      const requestId = json.request_id;
      if (!requestId) {
        throw new Error('Pixazo did not return a request_id');
      }

      // poll until completed or timeout
      let final;
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const r2 = await fetch(this.resultEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({ request_id: requestId }),
          timeout: 120000,
        });
        if (!r2.ok) {
          const t2 = await r2.text();
          throw new Error(`Pixazo result error ${r2.status}: ${t2}`);
        }
        const j2 = await r2.json();
        if (j2.status === 'COMPLETED') {
          final = j2;
          break;
        }
        if (j2.status === 'FAILED') {
          throw new Error('Pixazo processing failed: ' + (j2.error_message || 'unknown'));
        }
        // otherwise keep waiting
      }

      if (!final) {
        throw new Error('Pixazo processing timed out');
      }

      const imageUrlResult = final.images?.[0]?.url;
      if (!imageUrlResult) {
        throw new Error('Pixazo returned no image URL');
      }

      const elapsed = Date.now() - start;
      return {
        ok: true,
        previewUrl: imageUrlResult,
        processingTimeMs: elapsed,
        modelVersion: this.version,
      };
    } catch (err) {
      console.error('[PixazoProvider] error', err);
      let message = err.message || 'Unknown Pixazo error';
      // common confusion: 403 due to empty quota
      if (/balance/i.test(message)) {
        message += ' (your Pixazo subscription may have run out; try another provider or top up your plan)';
      }
      return {
        ok: false,
        error: message,
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }
  }
}
