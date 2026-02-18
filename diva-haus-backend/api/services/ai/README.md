# AI Provider System

## Overview

This directory contains the abstracted AI provider system for virtual try-on processing. The system allows you to easily swap between different AI providers (mock, Replicate, custom APIs, etc.) without changing the rest of your codebase.

## Architecture

```
ai/
├── interfaces.js              # Contract definitions (AIProviderInterface)
├── AIProviderFactory.js      # Factory for selecting providers
├── providers/
│   ├── MockProvider.js       # Mock implementation (for development)
│   └── [Future providers]   # ReplicateProvider, CustomAIProvider, etc.
└── README.md                 # This file
```

## How It Works

1. **Interface**: `AIProviderInterface` defines the contract all providers must follow
2. **Factory**: `AIProviderFactory` selects the provider based on `AI_PROVIDER` env variable
3. **Service**: `virtualTryOn.service.js` uses the factory to get a provider and delegates to it

## Current Providers

### Mock Provider (`mock`)
- **Purpose**: Development/testing with placeholder images
- **Configuration**: No additional config needed
- **Status**: ✅ Implemented

### FASHN VTON Provider (`fashn`)
- **Purpose**: Real virtual try-on using open‑source FASHN VTON v1.5 model
- **Configuration**: Requires a running Python micro-service; set
  `VTON_SERVICE_URL` to its `/vton` endpoint and choose
  `AI_PROVIDER=fashn`.
- **Status**: ✅ Implemented (Day 22)

### Future Providers

- **Replicate Provider** (`replicate`): Integration with Replicate API
- **Custom AI Provider** (`custom`): Integration with custom AI service

## Adding a New Provider

To add a new AI provider:

1. **Create the provider class** in `providers/YourProvider.js`:

```javascript
import { AIProviderInterface } from '../interfaces.js';

export class YourProvider extends AIProviderInterface {
  constructor() {
    super();
    this.name = 'your-provider';
  }

  getName() {
    return this.name;
  }

  isAvailable() {
    // Check if provider is configured (env vars, API keys, etc.)
    return Boolean(process.env.YOUR_PROVIDER_API_KEY);
  }

  async processTryOn(input) {
    // Your implementation here
    // Must return VirtualTryOnResponse format
    return {
      ok: true,
      previewUrl: '...',
      processingTimeMs: 1234,
      modelVersion: 'v1.0',
    };
  }
}
```

2. **Register it in `AIProviderFactory.js`**:

```javascript
import { YourProvider } from './providers/YourProvider.js';

// In getProvider() method:
case 'your-provider':
  return new YourProvider();
```

3. **Add environment variable** in `.env`:

```bash
AI_PROVIDER=your-provider
YOUR_PROVIDER_API_KEY=your_api_key_here
```

4. **Update `getAvailableProviders()`** in the factory:

```javascript
static getAvailableProviders() {
  return ['mock', 'your-provider'];
}
```

## Input/Output Contract

### Input (`VirtualTryOnInput`)
```typescript
{
  imageBuffer?: Buffer,        // Raw file buffer
  imageMimeType?: string,     // e.g., 'image/jpeg'
  originalName?: string,       // Original filename
  imageUrl?: string,          // URL to stored image (preferred)
  imagePublicId?: string,     // Storage public ID
  imageBase64?: string,        // Legacy: base64 encoded image
  productId: string           // Required: MongoDB ObjectId
}
```

### Output (`VirtualTryOnResponse`)
```typescript
{
  ok: boolean,                // Success/failure
  previewUrl?: string,         // URL to result image (if ok=true)
  error?: string,             // Error message (if ok=false)
  processingTimeMs?: number,  // Processing time
  modelVersion?: string       // Model version identifier
}
```

## Configuration

Set `AI_PROVIDER` in your `.env` file:

```bash
# Use mock provider (default)
AI_PROVIDER=mock

# Or use a real provider (when implemented)
AI_PROVIDER=replicate
```

## Testing

The mock provider is always available and returns placeholder images. This makes it perfect for:
- Development without API costs
- Testing the UI/UX flow
- CI/CD pipelines

## Day 21 Status

✅ Interface defined  
✅ Mock provider implemented  
✅ Factory pattern implemented  
✅ Service refactored to use abstraction  
✅ Environment variable configuration added  

**Next Steps (Day 22)**: Implement a real AI provider (e.g., Replicate API)
