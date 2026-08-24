import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const resumes = pgTable('resumes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSizeBytes: text('file_size_bytes'),
  mimeType: text('mime_type').notNull(),
  extractedText: text('extracted_text'),
  parsedData: jsonb('parsed_data'),
  parserVersion: text('parser_version').default('v1.0').notNull(),
  status: text('status', { enum: ['PENDING', 'PROCESSING', 'PARSED', 'FAILED'] }).default('PENDING').notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
