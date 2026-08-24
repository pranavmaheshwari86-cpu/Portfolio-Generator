import { z } from 'zod';
import type { TokenUsage, AIProviderName } from '@portfolio-ai/types';

export interface AIServiceGenerateOptions<T> {
  prompt: string;
  systemInstruction?: string;
  schema?: z.ZodType<T>;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIServiceResponse<T> {
  data: T;
  rawText: string;
  usage: TokenUsage;
  provider: AIProviderName;
  model: string;
}

export interface IAIProvider {
  name: AIProviderName;
  generateText(options: AIServiceGenerateOptions<string>): Promise<AIServiceResponse<string>>;
  generateStructured<T>(options: AIServiceGenerateOptions<T>): Promise<AIServiceResponse<T>>;
}
