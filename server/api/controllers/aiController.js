// server/api/controllers/aiController.js
// simple endpoints for inspecting AI provider configuration and status

import { AIProviderFactory } from '../services/ai/AIProviderFactory.js';

// GET /api/ai/providers
export function listProviders(req, res) {
  const available = AIProviderFactory.getAvailableProviders();
  res.json({available});
}

// GET /api/ai/health
export async function healthCheck(req, res) {
  const factory = AIProviderFactory;
  const current = factory.getProvider();
  const all = factory.getAvailableProviders();
  const checks = [];

  for (const name of all) {
    const prov = factory.getProvider(name);
    let status;
    if (prov && typeof prov.check === 'function') {
      try {
        status = await prov.check();
      } catch (e) {
        status = { ok: false, message: e.message };
      }
    } else {
      status = { ok: prov?.isAvailable() ?? false, message: 'no check() implemented' };
    }
    checks.push({ name, available: prov?.isAvailable() ?? false, ...status });
  }

  res.json({
    selected: current?.getName(),
    checks,
  });
}
