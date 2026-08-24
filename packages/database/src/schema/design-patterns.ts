import { pgTable, text, timestamp, uuid, jsonb, real } from 'drizzle-orm/pg-core';

export const designPatterns = pgTable('design_patterns', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  name: text('name').notNull(),
  variantKey: text('variant_key').notNull(),
  style: text('style').notNull(),
  density: text('density').notNull(),
  motion: text('motion').notNull(),
  bestForIndustries: jsonb('best_for_industries').$type<string[]>().default([]).notNull(),
  qualityScore: real('quality_score').default(0.95).notNull(),
  componentPath: text('component_path').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type DesignPatternRecord = typeof designPatterns.$inferSelect;
export type NewDesignPatternRecord = typeof designPatterns.$inferInsert;
