import { z } from 'zod';

// Core 12 Block JSON Types
export const BlockTypeSchema = z.enum([
  'paragraph',
  'heading_1',
  'heading_2',
  'heading_3',
  'todo_item',
  'toggle',
  'callout',
  'code_block',
  'latex_math',
  'image',
  'audio',
  'subpage_link',
  'canvas_embed',
  'flashcard_cloze'
]);
export type BlockType = z.infer<typeof BlockTypeSchema>;

// Universal System Anchors
export const SystemAnchorSchema = z.enum([
  'DAILY_JOURNAL',
  'MISCELLANEOUS',
  'ENCRYPTED_VAULT',
  'AUDIO_TRANSCRIPTS',
  'CAMERA_SCANS',
  'FLASHCARDS',
  'CANVAS_DOCUMENTS'
]);
export type SystemAnchor = z.infer<typeof SystemAnchorSchema>;

// Core Block Schema Definition
export const BlockSchema = z.object({
  id: z.string().uuid(),
  pageId: z.string().uuid(),
  parentBlockId: z.string().uuid().nullable().default(null),
  type: BlockTypeSchema,
  content: z.record(z.unknown()),
  orderKey: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Block = z.infer<typeof BlockSchema>;

// Core Page Schema Definition
export const PageSchema = z.object({
  id: z.string().uuid(),
  parentFolderId: z.string().uuid().nullable().default(null),
  parentPageId: z.string().uuid().nullable().default(null),
  title: z.string(),
  icon: z.string().optional(),
  coverImage: z.string().optional(),
  isEncrypted: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type Page = z.infer<typeof PageSchema>;

// Shared Repository Interfaces
export interface INoteRepository {
  getPageById(id: string): Promise<Page | null>;
  savePage(page: Page): Promise<void>;
  deletePage(id: string): Promise<void>;
  getBlocksByPageId(pageId: string): Promise<Block[]>;
  saveBlocks(blocks: Block[]): Promise<void>;
}

export interface IFolderRepository {
  getSystemFolder(anchor: SystemAnchor): Promise<string>;
}

export interface IVectorSearchEngine {
  findSimilarFolders(vector: number[], topK?: number): Promise<Array<{ folderId: string; score: number }>>;
}
