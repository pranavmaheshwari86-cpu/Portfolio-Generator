import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IAIProvider, AIServiceGenerateOptions, AIServiceResponse } from '../types.js';
import { calculateTokenCost } from '../cost-tracker.js';
import { parseAndCleanJson } from '../json-cleaner.js';

export class GeminiAIProvider implements IAIProvider {
  name = 'gemini' as const;
  private client: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (key) {
      this.client = new GoogleGenerativeAI(key);
    }
  }

  async generateText(options: AIServiceGenerateOptions<string>): Promise<AIServiceResponse<string>> {
    if (!this.client) {
      throw new Error('Gemini API key is not configured');
    }

    const modelName = options.model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const startTime = Date.now();

    const model = this.client.getGenerativeModel({
      model: modelName,
      systemInstruction: options.systemInstruction,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens,
      },
    });

    const response = await model.generateContent(options.prompt);
    const rawText = response.response.text();
    const latency = Date.now() - startTime;
    const usage = calculateTokenCost(
      modelName,
      response.response.usageMetadata?.promptTokenCount || 0,
      response.response.usageMetadata?.candidatesTokenCount || 0,
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
      throw new Error('Gemini API key is not configured');
    }

    const modelName = options.model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const startTime = Date.now();

    const model = this.client.getGenerativeModel({
      model: modelName,
      systemInstruction: options.systemInstruction,
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `${options.prompt}\n\nIMPORTANT: Respond with ONLY a valid JSON object matching the required structure. No markdown fences, no explanatory text.`;
    const response = await model.generateContent(prompt);
    const rawText = response.response.text();
    const parsed = parseAndCleanJson<T>(rawText);

    let validatedData = parsed as T;
    if (options.schema) {
      validatedData = options.schema.parse(parsed);
    }

    const latency = Date.now() - startTime;
    const usage = calculateTokenCost(
      modelName,
      response.response.usageMetadata?.promptTokenCount || 0,
      response.response.usageMetadata?.candidatesTokenCount || 0,
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
