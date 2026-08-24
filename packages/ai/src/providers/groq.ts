import OpenAI from 'openai';
import type { IAIProvider, AIServiceGenerateOptions, AIServiceResponse } from '../types.js';
import { calculateTokenCost } from '../cost-tracker.js';
import { parseAndCleanJson } from '../json-cleaner.js';

export class GroqProvider implements IAIProvider {
  name = 'groq' as const;
  private client: OpenAI | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GROQ_API_KEY;
    if (key) {
      this.client = new OpenAI({
        apiKey: key,
        baseURL: 'https://api.groq.com/openai/v1',
      });
    }
  }

  async generateText(options: AIServiceGenerateOptions<string>): Promise<AIServiceResponse<string>> {
    if (!this.client) {
      throw new Error('Groq API key is not configured');
    }

    const modelName = options.model || process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
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
      throw new Error('Groq API key is not configured');
    }

    const modelName = options.model || process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    const startTime = Date.now();

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (options.systemInstruction) {
      messages.push({ role: 'system', content: options.systemInstruction });
    }
    messages.push({
      role: 'user',
      content: `${options.prompt}\n\nRespond with ONLY valid JSON strictly matching the requested format without any preamble or thinking text.`,
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
