import { pgTable, text, timestamp, uuid, jsonb, integer } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { portfolios } from './portfolios.js';
import type { EnhancedPromptSpec, QAResult } from '@portfolio-ai/types';

export const generations = pgTable('generations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  portfolioId: uuid('portfolio_id').references(() => portfolios.id, { onDelete: 'set null' }),
  status: text('status', {
    enum: [
      'QUEUED',
      'ANALYZING',
      'DESIGNING',
      'GENERATING',
      'BUILDING',
      'VALIDATING',
      'REFINING',
      'COMPLETED',
      'FAILED',
    ],
  }).default('QUEUED').notNull(),
  rawPrompt: text('raw_prompt').notNull(),
  enhancedPrompt: jsonb('enhanced_prompt').$type<EnhancedPromptSpec>(),
  provider: text('provider').notNull(),
  model: text('model').notNull(),
  inputTokens: integer('input_tokens').default(0).notNull(),
  outputTokens: integer('output_tokens').default(0).notNull(),
  latencyMs: integer('latency_ms').default(0).notNull(),
  estimatedCostUsd: text('estimated_cost_usd').default('0.00').notNull(),
  qaResult: jsonb('qa_result').$type<QAResult>(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type GenerationRecord = typeof generations.$inferSelect;
export type NewGenerationRecord = typeof generations.$inferInsert;
