import { sqliteTable, text, real, integer, blob } from 'drizzle-orm/sqlite-core';
import { folders } from './folders';
import { pages } from './pages';

// 1. Primary Capture Sessions Table (100% Consistent with File 03)
export const captureSessions = sqliteTable('capture_sessions', {
  id: text('id').primaryKey(), // UUID v4
  status: text('status').notNull(), // 'IDLE' | 'RECORDING' | 'PROCESSING' | 'SUGGESTION' | 'FILED' | 'CANCELLED'
  targetFolderId: text('target_folder_id').references(() => folders.id), // Resolved folder ID after confirmation
  targetPageId: text('target_page_id').references(() => pages.id), // Optional target page ID if inserting inline
  mediaType: text('media_type').notNull(), // 'photo' | 'multi_photo' | 'audio' | 'text' | 'clipboard' | 'screen' | 'multi_modal'
  sessionData: text('session_data', { mode: 'json' }).notNull(), // JSON payload (paths, transcript, draft blocks)
  createdAt: text('created_at').notNull(), // ISO-8601 string
  updatedAt: text('updated_at').notNull(), // ISO-8601 string
});

// 2. Capture Chunks Table (Buffer table for granular multi-part session recovery)
export const captureChunks = sqliteTable('capture_chunks', {
  id: text('id').primaryKey(), // UUID v4
  sessionId: text('session_id').notNull().references(() => captureSessions.id, { onDelete: 'cascade' }),
  chunkType: text('chunk_type').notNull(), // 'photo' | 'audio_pcm' | 'text_snippet' | 'ocr_result'
  sequenceIndex: integer('sequence_index').notNull(), // Ordering sequence number
  filePath: text('file_path'), // Local cache disk path if binary media
  payload: text('payload', { mode: 'json' }), // JSON payload for text or metadata
  createdAt: text('created_at').notNull(),
});
