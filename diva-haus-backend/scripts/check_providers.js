#!/usr/bin/env node
// diva-haus-backend/scripts/check_providers.js
// simple command‑line tool to verify AI provider configuration and reachability

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// compute __dirname equivalent in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// load the same .env that the server would use
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { AIProviderFactory } from '../api/services/ai/AIProviderFactory.js';

async function main() {
  console.log('env', {
    AI_PROVIDER: process.env.AI_PROVIDER,
    PIXAZO_API_KEY: process.env.PIXAZO_API_KEY,
    HF_API_TOKEN: process.env.HF_API_TOKEN,
  });
  console.log('Configured AI_PROVIDER=', process.env.AI_PROVIDER);
  const names = AIProviderFactory.getAvailableProviders();
  console.log('Implemented providers:', names.join(', '));

  // construct each provider directly so we can inspect it without falling
  // back to another implementation.
  const providers = {
    mock: new (await import('../api/services/ai/providers/MockProvider.js')).MockProvider(),
    fashn: new (await import('../api/services/ai/providers/FashnProvider.js')).FashnProvider(),
    pixazo: new (await import('../api/services/ai/providers/PixazoProvider.js')).PixazoProvider(),
    huggingface: new (await import('../api/services/ai/providers/HuggingFaceProvider.js')).HuggingFaceProvider(),
  };

  for (const name of names) {
    const prov = providers[name];
    const info = { name, available: prov.isAvailable() };
    if (info.available && typeof prov.check === 'function') {
      try {
        info.check = await prov.check();
      } catch (e) {
        info.check = { ok: false, message: e.message };
      }
    }
    console.log(JSON.stringify(info, null, 2));
  }
}

main().catch((e) => {
  console.error('error running provider check', e);
  process.exit(1);
});
