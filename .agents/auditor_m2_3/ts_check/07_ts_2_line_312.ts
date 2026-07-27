import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { pages, blocks } from './foundation-schema';

// Flashcards Table
export const flashcards = sqliteTable('flashcards', {
  id: text('id').primaryKey(), // UUID
  pageId: text('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  sourceBlockId: text('source_block_id').references(() => blocks.id, { onDelete: 'set null' }),
  type: text('type').notNull(), // 'cloze' | 'qa' | 'image_occlusion'
  front: text('front').notNull(), // Front question / Cloze prompt text
  back: text('back').notNull(), // Back answer text
  clozeHint: text('cloze_hint'), // Optional hint for cloze cards
  
  // FSRS State Fields
  due: text('due').notNull(), // ISO-8601 Timestamp of next review
  stability: real('stability').notNull().default(0.0),
  difficulty: real('difficulty').notNull().default(0.0),
  elapsedDays: integer('elapsed_days').notNull().default(0),
  scheduledDays: integer('scheduled_days').notNull().default(0),
  repetition: integer('repetition').notNull().default(0),
  lapses: integer('lapses').notNull().default(0),
  state: text('state').notNull().default('New'), // 'New' | 'Learning' | 'Review' | 'Relearning'
  lastReview: text('last_review'), // ISO-8601 Timestamp
  
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Flashcard Review Logs Table (Historical Audit Trail)
export const flashcardReviewLogs = sqliteTable('flashcard_review_logs', {
  id: text('id').primaryKey(), // UUID
  cardId: text('card_id').notNull().references(() => flashcards.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1, 2, 3, 4
  state: text('state').notNull(), // State prior to review
  due: text('due').notNull(),
  stability: real('stability').notNull(),
  difficulty: real('difficulty').notNull(),
  elapsedDays: integer('elapsed_days').notNull(),
  lastElapsedDays: integer('last_elapsed_days').notNull(),
  scheduledDays: integer('scheduled_days').notNull(),
  review: text('review').notNull(), // ISO-8601 Timestamp of review execution
});
