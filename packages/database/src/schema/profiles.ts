import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import type { ProfessionalProfile } from '@portfolio-ai/types';

export const professionalProfiles = pgTable('professional_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  profession: text('profession').notNull(),
  seniority: text('seniority').notNull(),
  headline: text('headline').notNull(),
  summary: text('summary').notNull(),
  profileData: jsonb('profile_data').$type<ProfessionalProfile>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ProfessionalProfileRecord = typeof professionalProfiles.$inferSelect;
export type NewProfessionalProfileRecord = typeof professionalProfiles.$inferInsert;
