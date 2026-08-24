import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { portfolios } from './portfolios.js';

export const deployments = pgTable('deployments', {
  id: uuid('id').defaultRandom().primaryKey(),
  portfolioId: uuid('portfolio_id').references(() => portfolios.id, { onDelete: 'cascade' }).notNull(),
  provider: text('provider').default('internal-cdn').notNull(),
  subdomain: text('subdomain').notNull(),
  customDomain: text('custom_domain'),
  status: text('status', { enum: ['PENDING', 'DEPLOYED', 'FAILED', 'DECOMMISSIONED'] }).default('PENDING').notNull(),
  deploymentUrl: text('deployment_url').notNull(),
  staticAssetMap: jsonb('static_asset_map').$type<Record<string, string>>().default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type DeploymentRecord = typeof deployments.$inferSelect;
export type NewDeploymentRecord = typeof deployments.$inferInsert;
