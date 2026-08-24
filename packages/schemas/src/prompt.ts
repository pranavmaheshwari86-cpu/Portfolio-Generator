import { z } from 'zod';

export const enhancePromptInputSchema = z.object({
  rawPrompt: z.string().min(3, 'Prompt must be at least 3 characters long'),
  profession: z.string().optional(),
  targetAudience: z.array(z.string()).optional(),
  vibePreference: z.string().optional(),
});

export const enhancedPromptSpecSchema = z.object({
  originalPrompt: z.string(),
  profession: z.string(),
  seniority: z.string(),
  targetAudience: z.array(z.string()),
  brandPersonality: z.array(z.string()),
  visualDirection: z.string(),
  typographyDirection: z.string(),
  colorStrategy: z.string(),
  layoutGrammar: z.string(),
  contentPriority: z.array(z.string()),
  interactionPhilosophy: z.string(),
  keyConversionGoal: z.string(),
});

export type EnhancePromptInput = z.infer<typeof enhancePromptInputSchema>;
export type EnhancedPromptSpec = z.infer<typeof enhancedPromptSpecSchema>;
