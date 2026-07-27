import { sqliteTable, text, blob } from 'drizzle-orm/sqlite-core';
import { folders, pages, blocks } from './foundation-schema';

// 1. Folder Vector Embeddings (Stores centroid representation of folder contents)
export const folderVectors = sqliteTable('folder_vectors', {
  folderId: text('folder_id').primaryKey().references(() => folders.id, { onDelete: 'cascade' }),
  embedding: blob('embedding').notNull(), // 384-dim Float32 Array (1536 bytes)
  updatedAt: text('updated_at').notNull(),
});

// 2. Page Vector Embeddings (Stores consolidated page embedding)
export const pageVectors = sqliteTable('page_vectors', {
  pageId: text('page_id').primaryKey().references(() => pages.id, { onDelete: 'cascade' }),
  embedding: blob('embedding').notNull(), // 384-dim Float32 Array (1536 bytes)
  updatedAt: text('updated_at').notNull(),
});

// 3. Block Vector Embeddings (Optional granular block vector indexing)
export const blockVectors = sqliteTable('block_vectors', {
  blockId: text('block_id').primaryKey().references(() => blocks.id, { onDelete: 'cascade' }),
  pageId: text('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  embedding: blob('embedding').notNull(), // 384-dim Float32 Array (1536 bytes)
  updatedAt: text('updated_at').notNull(),
});
