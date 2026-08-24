import type { TokenUsage, AIProviderName } from '@portfolio-ai/types';

// Pricing per 1M tokens in USD
const PRICING_PER_MILLION: Record<string, { input: number; output: number }> = {
  // Gemini 2.5/Flash/Pro
  'gemini-2.5-flash': { input: 0.075, output: 0.30 },
  'gemini-1.5-flash': { input: 0.075, output: 0.30 },
  'gemini-1.5-pro': { input: 1.25, output: 5.00 },
  // OpenAI
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o': { input: 2.50, output: 10.00 },
  // Anthropic
  'claude-3-5-haiku-20241022': { input: 0.80, output: 4.00 },
  'claude-3-5-sonnet-20241022': { input: 3.00, output: 15.00 },
  // Mock fallback
  'mock-model': { input: 0.0, output: 0.0 },
};

export function calculateTokenCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  latencyMs: number
): TokenUsage {
  const pricing = PRICING_PER_MILLION[model] || { input: 0.15, output: 0.60 };
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  const totalCost = Number((inputCost + outputCost).toFixed(6));

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    estimatedCostUsd: totalCost,
    latencyMs,
  };
}
