import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  profession: text('profession'),
  role: text('role', { enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] }).default('USER').notNull(),
  plan: text('plan', { enum: ['FREE', 'PRO', 'ENTERPRISE'] }).default('FREE').notNull(),
  subscriptionStatus: text('subscription_status', { enum: ['ACTIVE', 'CANCELLED', 'PAST_DUE'] }).default('ACTIVE').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
