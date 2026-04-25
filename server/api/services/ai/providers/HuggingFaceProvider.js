// server/api/services/ai/providers/HuggingFaceProvider.js
// Fallback provider that uses the Hugging Face Inference API to perform
// a text‑to‑image generation. We construct a prompt containing URLs for the
// person and garment images, then upload the resulting PNG to storage.

import { AIProviderInterface } from '../interfaces.js';
import storageService from '../../storage.service.js';
import fetch from 'node-fetch';
import Product from '../../../models/Product.js';

export class HuggingFaceProvider extends AIProviderInterface {
  constructor() {
    super();
    this.name = 'huggingface';
    this.model = process.env.HF_API_MODEL || 'runwayml/stable-diffusion-v1-5';
    // As of early 2026 the old api-inference endpoint returns 410; the
    // router URL is the recommended replacement per HF error message.
    this.endpoint = `https://router.huggingface.co/models/${this.model}`;
    this.token = process.env.HF_API_TOKEN;
    this.version = `hf-${this.model}`;
  }

  getName() {
    return this.name;
  }

  isAvailable() {
    return !!this.token;
  }

  /**
   * Perform a lightweight sanity check on the configured token/model.
   * Does **not** perform a full try-on (which would use up quota).
   * @returns {Promise<{ok:boolean,message:string}>}
   */
  async check() {
    if (!this.token) {
      return { ok: false, message: 'no HF_API_TOKEN provided' };
    }
    try {
      // note: the public DNS for `api.huggingface.co` no longer resolves
      // reliably; use the documented `huggingface.co/api` path instead.
      const whoami = await fetch('https://huggingface.co/api/whoami-v2', {
        headers: { Authorization: `Bearer ${this.token}` },
        timeout: 10000,
      });
      if (!whoami.ok) {
        const text = await whoami.text();
        return { ok: false, message: `whoami failed: HTTP ${whoami.status} ${text}` };
      }
      const info = await whoami.json();
      // token itself is valid; now check the model endpoint for permission
      try {
        const probe = await fetch(this.endpoint, {
          method: 'HEAD',
          headers: { Authorization: `Bearer ${this.token}` },
          timeout: 10000,
        });
        if (probe.status === 404) {
          return { ok: false, message: `model not accessible (maybe license not accepted?)` };
        }
      } catch (e) {
        // ignore network errors here, we'll still report token validity
      }
      return { ok: true, message: `token valid (${info.model?.length ? 'model-facing' : 'general'})` };
    } catch (err) {
      return { ok: false, message: `token check error: ${err.message}` };
    }
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
        error: 'person image URL and productId are required for HuggingFace fallback',
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }

    // fetch garment URL from database
    let garmentUrl;
    try {
      const prod = await Product.findById(productId).lean();
      garmentUrl = prod?.image;
    } catch (err) {
      console.error('[HuggingFaceProvider] error fetching product', err);
    }
    if (!garmentUrl) {
      return {
        ok: false,
        error: 'unable to determine garment image for product ' + productId,
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }

    // build a descriptive prompt that mentions both URLs
    const prompt = `Generate a photorealistic image of the person shown at ${imageUrl} wearing the garment shown at ${garmentUrl}. Preserve the person's face, body, pose and lighting. Do not alter the background.`;

    const start = Date.now();
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          options: { wait_for_model: true },
        }),
        timeout: 120000,
      });

      if (!response.ok) {
        const txt = await response.text();

        // a 404 usually means the model identifier was wrong or the token
        // does not have access to that repository (e.g. you haven't agreed
        // to the model's license on the Hugging Face website). Provide a
        // more actionable message so the developer isn't left puzzled.
        if (response.status === 404) {
          throw new Error(
            `HuggingFace model not found (404). ` +
              `Ensure HF_API_MODEL is correct and that your token has ` +
              `permission/you've accepted the license on the model page ` +
              `(e.g. https://huggingface.co/${this.model}). ` +
              `The URL must include the full model ID exactly as shown on HF.`
          );
        }

        throw new Error(`HuggingFace API error ${response.status}: ${txt}`);
      }

      const buf = Buffer.from(await response.arrayBuffer());
      const uploadResult = await storageService.upload(
        {
          buffer: buf,
          originalname: 'tryon-hf.png',
          mimetype: 'image/png',
        },
        'try-on-results'
      );
      const elapsed = Date.now() - start;

      if (!uploadResult.success) {
        // fall back to returning base64 directly if upload fails
        return {
          ok: true,
          previewUrl: undefined,
          previewBase64: buf.toString('base64'),
          processingTimeMs: elapsed,
          modelVersion: this.version,
        };
      }

      return {
        ok: true,
        previewUrl: uploadResult.url,
        processingTimeMs: elapsed,
        modelVersion: this.version,
      };
    } catch (err) {
      console.error('[HuggingFaceProvider] error', err);
      return {
        ok: false,
        error: err.message,
        processingTimeMs: 0,
        modelVersion: this.version,
      };
    }
  }
}
