import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const pagesTable = sqliteTable('pages', {
  id: text('id').primaryKey(),
  parentFolderId: text('parent_folder_id'),
  parentPageId: text('parent_page_id'),
  title: text('title').notNull(),
  icon: text('icon'),
  coverImage: text('cover_image'),
  isEncrypted: integer('is_encrypted', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

export const blocksTable = sqliteTable('blocks', {
  id: text('id').primaryKey(),
  pageId: text('page_id').notNull().references(() => pagesTable.id, { onDelete: 'cascade' }),
  parentBlockId: text('parent_block_id'),
  type: text('type').notNull(),
  content: text('content').notNull(), // JSON payload string
  orderKey: text('order_key').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull()
});

export const tagsTable = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color')
});

export const pageTagsTable = sqliteTable('page_tags', {
  pageId: text('page_id').notNull().references(() => pagesTable.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tagsTable.id, { onDelete: 'cascade' })
});

export const anchorsTable = sqliteTable('anchors', {
  id: text('id').primaryKey(),
  anchorType: text('anchor_type').notNull().unique(),
  targetFolderId: text('target_folder_id').notNull()
});

export const vectorsTable = sqliteTable('vectors', {
  id: text('id').primaryKey(),
  entityType: text('entity_type').notNull(), // 'page' | 'folder' | 'block'
  entityId: text('entity_id').notNull(),
  embedding: text('embedding').notNull() // JSON array of 384 floats
});

export const captureSessionsTable = sqliteTable('capture_sessions', {
  id: text('id').primaryKey(),
  sourceType: text('source_type').notNull(),
  rawPayload: text('raw_payload').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull()
});

export const canvasDocumentsTable = sqliteTable('canvas_documents', {
  id: text('id').primaryKey(),
  pageId: text('page_id').notNull().references(() => pagesTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  width: real('width').notNull(),
  height: real('height').notNull()
});

export const canvasLayersTable = sqliteTable('canvas_layers', {
  id: text('id').primaryKey(),
  canvasId: text('canvas_id').notNull().references(() => canvasDocumentsTable.id, { onDelete: 'cascade' }),
  layerOrder: integer('layer_order').notNull(),
  isVisible: integer('is_visible', { mode: 'boolean' }).default(true)
});

export const canvasStrokesTable = sqliteTable('canvas_strokes', {
  id: text('id').primaryKey(),
  layerId: text('layer_id').notNull().references(() => canvasLayersTable.id, { onDelete: 'cascade' }),
  pointsData: text('points_data').notNull(),
  strokeColor: text('stroke_color').notNull(),
  strokeWidth: real('stroke_width').notNull()
});

export const pdfAnnotationsTable = sqliteTable('pdf_annotations', {
  id: text('id').primaryKey(),
  pageId: text('page_id').notNull().references(() => pagesTable.id, { onDelete: 'cascade' }),
  pdfUrl: text('pdf_url').notNull(),
  pageIndex: integer('page_index').notNull(),
  quadPointsJson: text('quad_points_json').notNull(),
  annotationType: text('annotation_type').notNull()
});

export const imageOcclusionMasksTable = sqliteTable('image_occlusion_masks', {
  id: text('id').primaryKey(),
  annotationId: text('annotation_id').notNull().references(() => pdfAnnotationsTable.id, { onDelete: 'cascade' }),
  rectCoordinatesJson: text('rect_coordinates_json').notNull(),
  occlusionAnswer: text('occlusion_answer')
});
