// diva-haus-backend/api/services/ai/AIProviderFactory.js
// Day 21: Factory for selecting and initializing AI providers

import { MockProvider } from './providers/MockProvider.js';
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
    const providerName = process.env.AI_PROVIDER || 'mock';
    
    console.log(`[AIProviderFactory] Selecting provider: ${providerName}`);

    switch (providerName.toLowerCase()) {
      case 'mock':
        return new MockProvider();

      // Future providers will be added here:
      // case 'replicate':
      //   return new ReplicateProvider();
      // case 'custom':
      //   return new CustomAIProvider();

      default:
        console.warn(`[AIProviderFactory] Unknown provider "${providerName}", falling back to mock`);
        return new MockProvider();
    }
  }

  /**
   * Get list of available provider names
   * @returns {string[]} Array of provider names
   */
  static getAvailableProviders() {
    return ['mock']; // Add more as providers are implemented
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
