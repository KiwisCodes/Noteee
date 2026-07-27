import { sqliteTable, text, real, integer, blob } from 'drizzle-orm/sqlite-core';
import { pages, blocks, flashcards } from './foundation-schema';

// 1. Canvas Documents Table (Container for drawing canvases)
export const canvasDocuments = sqliteTable('canvas_documents', {
  id: text('id').primaryKey(), // UUID v4
  pageId: text('page_id').references(() => pages.id, { onDelete: 'cascade' }),
  sourceBlockId: text('source_block_id').references(() => blocks.id, { onDelete: 'set null' }),
  title: text('title').notNull().default('Untitled Canvas'),
  matrixTransform: text('matrix_transform').notNull().default('[1,0,0,1,0,0]'), // [a,b,c,d,tx,ty]
  width: real('width'), // Optional fixed bounding width (null for infinite canvas)
  height: real('height'), // Optional fixed bounding height
  backgroundColor: text('background_color').notNull().default('#FFFFFF'),
  gridStyle: text('grid_style').notNull().default('dots'), // 'none' | 'dots' | 'grid' | 'lines'
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 2. Canvas Layers Table (Z-ordered drawing layers)
export const canvasLayers = sqliteTable('canvas_layers', {
  id: text('id').primaryKey(), // UUID v4
  canvasId: text('canvas_id').notNull().references(() => canvasDocuments.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default('Layer 1'),
  zIndex: integer('z_index').notNull().default(0),
  isVisible: integer('is_visible', { mode: 'boolean' }).notNull().default(true),
  isLocked: integer('is_locked', { mode: 'boolean' }).notNull().default(false),
  opacity: real('opacity').notNull().default(1.0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 3. Canvas Strokes Table (Individual vector stroke primitives)
export const canvasStrokes = sqliteTable('canvas_strokes', {
  id: text('id').primaryKey(), // UUID v4
  canvasId: text('canvas_id').notNull().references(() => canvasDocuments.id, { onDelete: 'cascade' }),
  layerId: text('layer_id').notNull().references(() => canvasLayers.id, { onDelete: 'cascade' }),
  toolType: text('tool_type').notNull(), // 'pen' | 'pencil' | 'highlighter' | 'eraser' | 'shape'
  color: text('color').notNull().default('#000000'), // Hex color string
  size: real('size').notNull().default(3.0), // Base stroke width in canvas points
  opacity: real('opacity').notNull().default(1.0),
  blendMode: text('blend_mode').notNull().default('SrcOver'), // 'SrcOver' | 'Multiply' | 'Clear'
  strokeCap: text('stroke_cap').notNull().default('round'), // 'round' | 'butt' | 'square'
  strokeJoin: text('stroke_join').notNull().default('round'), // 'round' | 'bevel' | 'miter'
  
  // Point Data Payload (Compressed JSON string array or binary blob of StrokePoint[])
  points: text('points').notNull(), // JSON string: [{x, y, pressure, timestamp}, ...]
  
  // Spatial Axis-Aligned Bounding Box (AABB) for Fast Offscreen Culling
  minX: real('min_x').notNull(),
  minY: real('min_y').notNull(),
  maxX: real('max_x').notNull(),
  maxY: real('max_y').notNull(),
  
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 4. PDF Annotations Table (PDF Highlights, Underlines, & Text Quotes)
export const pdfAnnotations = sqliteTable('pdf_annotations', {
  id: text('id').primaryKey(), // UUID v4
  pageId: text('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
  pdfSourceUri: text('pdf_source_uri').notNull(),
  pdfPageIndex: integer('pdf_page_index').notNull(), // 0-based page index
  annotationType: text('annotation_type').notNull(), // 'highlight' | 'underline' | 'strikethrough' | 'freehand'
  color: text('color').notNull().default('#FDE047'),
  textQuote: text('text_quote'), // Selected raw text snippet
  quadpoints: text('quadpoints'), // JSON serialized array of PDFTextQuadpoint[]
  strokeId: text('stroke_id').references(() => canvasStrokes.id, { onDelete: 'cascade' }), // Optional link if freehand ink
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 5. Image Occlusion Masks Table (Mask Overlays linked to Sector 4 Flashcards)
export const imageOcclusionMasks = sqliteTable('image_occlusion_masks', {
  id: text('id').primaryKey(), // UUID v4
  cardId: text('card_id').notNull().references(() => flashcards.id, { onDelete: 'cascade' }),
  canvasId: text('canvas_id').references(() => canvasDocuments.id, { onDelete: 'set null' }),
  maskIndex: integer('mask_index').notNull(), // 1, 2, 3...
  relX: real('rel_x').notNull(), // 0.0 - 1.0 bounding box ratio
  relY: real('rel_y').notNull(),
  relWidth: real('rel_width').notNull(),
  relHeight: real('rel_height').notNull(),
  label: text('label'),
  color: text('color').default('#3B82F6'),
  createdAt: text('created_at').notNull(),
});