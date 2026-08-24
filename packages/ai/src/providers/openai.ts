import OpenAI from 'openai';
import type { IAIProvider, AIServiceGenerateOptions, AIServiceResponse } from '../types.js';
import { calculateTokenCost } from '../cost-tracker.js';
import { parseAndCleanJson } from '../json-cleaner.js';

export class OpenAIProvider implements IAIProvider {
  name = 'openai' as const;
  private client: OpenAI | null = null;

  constructor(apiKey?: string, baseURL?: string) {
    const key = apiKey || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    const isOpenRouter = key?.startsWith('sk-or-v1-') || (!!process.env.OPENROUTER_API_KEY && !apiKey);
    const base = baseURL || process.env.OPENAI_BASE_URL || (isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined);
    if (key) {
      this.client = new OpenAI({
        apiKey: key,
        baseURL: base,
        defaultHeaders: isOpenRouter ? {
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Portfolio AI Generator',
        } : undefined,
      });
    }
  }

  async generateText(options: AIServiceGenerateOptions<string>): Promise<AIServiceResponse<string>> {
    if (!this.client) {
      throw new Error('OpenAI API key is not configured');
    }

    const isOR = !!process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY?.startsWith('sk-or-v1-');
    const defaultModel = isOR ? 'openai/gpt-4o-mini' : 'gpt-4o-mini';
    const modelName = options.model || (isOR ? (process.env.OPENROUTER_MODEL || defaultModel) : (process.env.OPENAI_MODEL || defaultModel));
    const startTime = Date.now();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (options.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }
    messages.push({ role: 'user', content: options.prompt });

    const completion = await this.client.chat.completions.create({
      model: modelName,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
    });

    const rawText = completion.choices[0]?.message?.content || '';
    const latency = Date.now() - startTime;
    const usage = calculateTokenCost(
      modelName,
      completion.usage?.prompt_tokens || 0,
      completion.usage?.completion_tokens || 0,
      latency
    );

    return {
      data: rawText,
      rawText,
      usage,
      provider: this.name,
      model: modelName,
    };
  }

  async generateStructured<T>(options: AIServiceGenerateOptions<T>): Promise<AIServiceResponse<T>> {
    if (!this.client) {
      throw new Error('OpenAI API key is not configured');
    }

    const isOR = !!process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY?.startsWith('sk-or-v1-');
    const defaultModel = isOR ? 'openai/gpt-4o-mini' : 'gpt-4o-mini';
    const modelName = options.model || (isOR ? (process.env.OPENROUTER_MODEL || defaultModel) : (process.env.OPENAI_MODEL || defaultModel));
    const startTime = Date.now();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (options.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }
    messages.push({
      role: 'user',
      content: `${options.prompt}\n\nRespond with ONLY valid JSON strictly matching the requested format.`,
    });

    let completion: any;
    try {
      completion = await this.client.chat.completions.create({
        model: modelName,
        messages,
        temperature: options.temperature ?? 0.2,
        response_format: { type: 'json_object' },
      });
    } catch {
      completion = await this.client.chat.completions.create({
        model: modelName,
        messages,
        temperature: options.temperature ?? 0.2,
      });
    }

    const rawText = completion.choices[0]?.message?.content || '{}';
    const parsed = parseAndCleanJson<T>(rawText);

    let validatedData = parsed as T;
    if (options.schema) {
      validatedData = options.schema.parse(parsed);
    }

    const latency = Date.now() - startTime;
    const usage = calculateTokenCost(
      modelName,
      completion.usage?.prompt_tokens || 0,
      completion.usage?.completion_tokens || 0,
      latency
    );

    return {
      data: validatedData,
      rawText,
      usage,
      provider: this.name,
      model: modelName,
    };
  }
}
