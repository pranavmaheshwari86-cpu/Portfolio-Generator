import { pgTable, text, timestamp, uuid, integer, jsonb, date } from 'drizzle-orm/pg-core';
import { portfolios } from './portfolios.js';

export const portfolioAnalytics = pgTable('portfolio_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  portfolioId: uuid('portfolio_id').references(() => portfolios.id, { onDelete: 'cascade' }).notNull(),
  date: date('date').notNull(),
  pageViews: integer('page_views').default(0).notNull(),
  uniqueVisitors: integer('unique_visitors').default(0).notNull(),
  ctaClicks: integer('cta_clicks').default(0).notNull(),
  referrerData: jsonb('referrer_data').$type<Record<string, number>>().default({}).notNull(),
  deviceData: jsonb('device_data').$type<{ desktop: number; mobile: number; tablet: number }>().default({ desktop: 0, mobile: 0, tablet: 0 }).notNull(),
  countryData: jsonb('country_data').$type<Record<string, number>>().default({}).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PortfolioAnalyticsRecord = typeof portfolioAnalytics.$inferSelect;
export type NewPortfolioAnalyticsRecord = typeof portfolioAnalytics.$inferInsert;
