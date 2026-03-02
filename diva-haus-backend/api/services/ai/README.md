# AI Provider System

## Overview

This directory contains the abstracted AI provider system for virtual try-on processing. The system allows you to easily swap between different AI providers (mock, FASHN, Hugging Face, custom APIs, etc.) without changing the rest of your codebase. The factory also includes simple fallback logic so that if the requested provider is not configured the next available one is chosen automatically.

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

### Pixazo Fashn Virtual Try-On (`pixazo`)
- **Purpose**: Free/low-cost hosted virtual try-on API provided by Pixazo.
  The service accepts separate URLs for person and garment images and
  returns a combined try-on image. It offers a small complimentary tier
  suitable for development and light usage. You’ll need to sign up for a
  subscription key.
- **Configuration**: Set `AI_PROVIDER=pixazo`. Provide a key via
  `PIXAZO_API_KEY` and optionally override the base URL with
  `PIXAZO_BASE_URL` (defaults to
  `https://gateway.pixazo.ai/fashn-virtual-try-on/v1`).

  ```bash
  # in `.env`:
  AI_PROVIDER=pixazo
  PIXAZO_API_KEY=your_pixazo_subscription_key
  # optional:
  # PIXAZO_BASE_URL=https://gateway.pixazo.ai/fashn-virtual-try-on/v1
  ```
- **Notes**:
  - Pixazo keys start with `c` followed by hex digits and may include a
    small number of free requests. If you see a `403` error containing the
    word "balance" it means your credit has been exhausted.
    The provider will automatically fall back to the Hugging Face
    text-to-image API if that service is also configured.
  - Balance-related errors are surfaced in the backend response with an
    explanatory message and a suggestion to either top up or switch
    providers.
- **Status**: ✅ Implemented (Day 25)

### Hugging Face Text-to-Image Fallback (`huggingface` / `hf`)
- **Purpose**: Generic image generation using the Hugging Face
  Inference API (via the newer `router.huggingface.co` endpoint).
  This provider constructs a prompt containing the **public URLs** of
  the person and garment and asks a stable diffusion model to render the
  try‑on result.
- **Configuration**: Set `AI_PROVIDER=huggingface` (or `hf`).
  Provide a token via `HF_API_TOKEN` and optionally an alternative
  model via `HF_API_MODEL` (defaults to `runwayml/stable-diffusion-v1-5`).

  ⚠️ **Important:** Hugging Face no longer offers unlimited free API
  usage; the token is free to create but you may need a paid plan once
  the complimentary quota is exhausted. Some models also require you to
  accept a license or request access on their Hugging Face page before
  they can be used via API. If you see a `404 Not Found` error, visit
  the model URL and click “Accept”/“Request access” (e.g.
  https://huggingface.co/models/runwayml/stable-diffusion-v1-5).  
- **Status**: ✅ Implemented as of Day 23

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

# Use the FASHN VTON micro-service (fast, accurate but requires Python)
AI_PROVIDER=fashn

# Or use the free Hugging Face fallback (text‑to‑image using URLs)
AI_PROVIDER=huggingface  # alias: hf
HF_API_TOKEN=your_hf_token_here
# optional: change model
HF_API_MODEL=stabilityai/stable-diffusion-2-1
```

> **Note:** the backend endpoints always return HTTP 200 even if an AI
> provider reports a failure; error details are carried in
> `response.ok=false` and the front‑end helper functions convert these
> into thrown errors. This prevents HTTP 500 statuses from cluttering the
> network log when, for example, Pixazo runs out of credits.

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
