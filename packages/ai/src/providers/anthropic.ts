import Anthropic from '@anthropic-ai/sdk';
import type { IAIProvider, AIServiceGenerateOptions, AIServiceResponse } from '../types.js';
import { calculateTokenCost } from '../cost-tracker.js';

export class AnthropicProvider implements IAIProvider {
  name = 'anthropic' as const;
  private client: Anthropic | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (key) {
      this.client = new Anthropic({ apiKey: key });
    }
  }

  async generateText(options: AIServiceGenerateOptions<string>): Promise<AIServiceResponse<string>> {
    if (!this.client) {
      throw new Error('Anthropic API key is not configured');
    }

    const modelName = options.model || 'claude-3-5-haiku-20241022';
    const startTime = Date.now();

    const response = await this.client.messages.create({
      model: modelName,
      max_tokens: options.maxTokens || 4096,
      system: options.systemInstruction,
      messages: [{ role: 'user', content: options.prompt }],
      temperature: options.temperature ?? 0.7,
    });

    const block = response.content[0];
    const rawText = block?.type === 'text' ? block.text : '';
    const latency = Date.now() - startTime;
    const usage = calculateTokenCost(
      modelName,
      response.usage.input_tokens,
      response.usage.output_tokens,
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
      throw new Error('Anthropic API key is not configured');
    }

    const modelName = options.model || 'claude-3-5-haiku-20241022';
    const startTime = Date.now();

    const promptText = `${options.prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the required structure. Do NOT wrap in markdown codeblocks. Return valid JSON only.`;

    const response = await this.client.messages.create({
      model: modelName,
      max_tokens: options.maxTokens || 4096,
      system: options.systemInstruction,
      messages: [{ role: 'user', content: promptText }],
      temperature: options.temperature ?? 0.2,
    });

    const block = response.content[0];
    const rawText = block?.type === 'text' ? block.text : '{}';
    const cleanJson = rawText.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    let validatedData = parsed as T;
    if (options.schema) {
      validatedData = options.schema.parse(parsed);
    }

    const latency = Date.now() - startTime;
    const usage = calculateTokenCost(
      modelName,
      response.usage.input_tokens,
      response.usage.output_tokens,
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
