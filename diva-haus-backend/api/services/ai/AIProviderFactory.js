// diva-haus-backend/api/services/ai/AIProviderFactory.js
// Day 21: Factory for selecting and initializing AI providers

import { MockProvider } from './providers/MockProvider.js';
import { FashnProvider } from './providers/FashnProvider.js';
import { HuggingFaceProvider } from './providers/HuggingFaceProvider.js';
import { PixazoProvider } from './providers/PixazoProvider.js';
// Future providers will be imported here:
// import { ReplicateProvider } from './providers/ReplicateProvider.js';
// import { CustomAIProvider } from './providers/CustomAIProvider.js';

/**
 * Factory class for creating AI provider instances
 * Selects provider based on environment variable AI_PROVIDER
 */
export class AIProviderFactory {
  /**
   * Get the configured AI provider instance
   * @returns {AIProviderInterface} Provider instance
   * @throws {Error} If provider is not found or not available
   */
  static getProvider() {
    const requested = (process.env.AI_PROVIDER || 'mock').toLowerCase();

    // define an ordered list of candidates; requested one first so we honour
    // the user's explicit choice, then fall back to others if it's not
    // configured, finally mock as a last resort.
    const order = [requested, 'pixazo', 'huggingface', 'fashn', 'mock'];

    for (const name of order) {
      let instance;
      switch (name) {
        case 'mock':
          instance = new MockProvider();
          break;
        case 'fashn':
          instance = new FashnProvider();
          break;
        case 'pixazo':
          instance = new PixazoProvider();
          break;
        case 'huggingface':
        case 'hf':
          instance = new HuggingFaceProvider();
          break;
        // additional providers would go here
        default:
          continue;
      }

      if (instance && instance.isAvailable()) {
        if (name !== requested) {
          console.warn(
            `[AIProviderFactory] Requested provider "${requested}" is not available, falling back to "${name}"`
          );
        }
        return instance;
      }
    }

    // Should never happen since mock is always available, but just in case
    console.warn('[AIProviderFactory] No AI providers available, using mock');
    return new MockProvider();
  }

  /**
   * Get list of available provider names
   * @returns {string[]} Array of provider names
   */
  static getAvailableProviders() {
    return ['mock', 'fashn', 'pixazo', 'huggingface']; // Add more as providers are implemented
  }

  /**
   * Check if a specific provider is available
   * @param {string} providerName - Name of the provider
   * @returns {boolean} True if provider can be instantiated
   */
  static isProviderAvailable(providerName) {
    try {
      const provider = this.getProvider();
      return provider.getName() === providerName.toLowerCase() && provider.isAvailable();
    } catch (error) {
      console.error(`[AIProviderFactory] Error checking provider availability:`, error);
      return false;
    }
  }
}
