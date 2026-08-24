import type { IAIProvider, AIServiceGenerateOptions, AIServiceResponse } from './types.js';
import { GeminiAIProvider } from './providers/gemini.js';
import { OpenAIProvider } from './providers/openai.js';
import { AnthropicProvider } from './providers/anthropic.js';
import { GroqProvider } from './providers/groq.js';
import { MockAIProvider } from './providers/mock.js';
import type { AIProviderName } from '@portfolio-ai/types';

export class AIService {
  private providers: Map<AIProviderName, IAIProvider> = new Map();
  private defaultProviderName: AIProviderName;

  constructor(defaultProvider?: AIProviderName) {
    this.providers.set('gemini', new GeminiAIProvider());
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('anthropic', new AnthropicProvider());
    this.providers.set('groq', new GroqProvider());
    this.providers.set('mock', new MockAIProvider());

    this.defaultProviderName = defaultProvider || (process.env.AI_DEFAULT_PROVIDER as AIProviderName) || 'gemini';
  }

  getProvider(providerName?: AIProviderName): IAIProvider {
    const target = providerName || this.defaultProviderName;
    const provider = this.providers.get(target);
    if (!provider) {
      // Fallback to mock provider safely
      return this.providers.get('mock')!;
    }
    return provider;
  }

  async generateText(options: AIServiceGenerateOptions<string>, providerName?: AIProviderName): Promise<AIServiceResponse<string>> {
    const primary = providerName || this.defaultProviderName;
    const candidates: AIProviderName[] = [primary];

    for (const p of ['groq', 'openai', 'gemini', 'anthropic'] as AIProviderName[]) {
      if (!candidates.includes(p) && this.providers.has(p)) {
        candidates.push(p);
      }
    }
    candidates.push('mock');

    for (const candidate of candidates) {
      try {
        const provider = this.providers.get(candidate);
        if (!provider) continue;
        return await provider.generateText(options);
      } catch (error) {
        if (candidate !== 'mock') {
          console.warn(`[AIService] Provider ${candidate} failed: ${(error as Error).message}. Cascading to next provider...`);
        }
      }
    }

    const fallback = this.providers.get('mock')!;
    return await fallback.generateText(options);
  }

  async generateStructured<T>(options: AIServiceGenerateOptions<T>, providerName?: AIProviderName): Promise<AIServiceResponse<T>> {
    const primary = providerName || this.defaultProviderName;
    const candidates: AIProviderName[] = [primary];

    for (const p of ['groq', 'openai', 'gemini', 'anthropic'] as AIProviderName[]) {
      if (!candidates.includes(p) && this.providers.has(p)) {
        candidates.push(p);
      }
    }
    candidates.push('mock');

    for (const candidate of candidates) {
      try {
        const provider = this.providers.get(candidate);
        if (!provider) continue;
        return await provider.generateStructured(options);
      } catch (error) {
        if (candidate !== 'mock') {
          console.warn(`[AIService] Provider ${candidate} failed: ${(error as Error).message}. Cascading to next provider...`);
        }
      }
    }

    const fallback = this.providers.get('mock')!;
    return await fallback.generateStructured(options);
  }
}
