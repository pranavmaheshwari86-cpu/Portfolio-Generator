import { pgTable, text, timestamp, uuid, jsonb, integer, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import type { PortfolioSchema, DesignDNA } from '@portfolio-ai/types';

export const portfolios = pgTable('portfolios', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  status: text('status', { enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] }).default('DRAFT').notNull(),
  version: integer('version').default(1).notNull(),
  publishedUrl: text('published_url'),
  customDomain: text('custom_domain').unique(),
  customDomainVerified: boolean('custom_domain_verified').default(false).notNull(),
  designDNA: jsonb('design_dna').$type<DesignDNA>().notNull(),
  schemaData: jsonb('schema_data').$type<PortfolioSchema>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const portfolioVersions = pgTable('portfolio_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  portfolioId: uuid('portfolio_id').references(() => portfolios.id, { onDelete: 'cascade' }).notNull(),
  versionNumber: integer('version_number').notNull(),
  changeSummary: text('change_summary').default('Generation/edit update').notNull(),
  schemaSnapshot: jsonb('schema_snapshot').$type<PortfolioSchema>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PortfolioRecord = typeof portfolios.$inferSelect;
export type NewPortfolioRecord = typeof portfolios.$inferInsert;
export type PortfolioVersionRecord = typeof portfolioVersions.$inferSelect;
export type NewPortfolioVersionRecord = typeof portfolioVersions.$inferInsert;
