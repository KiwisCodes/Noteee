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

// Regex for parsing cloze deletions: {{c1::answer::hint}}
export const CLOZE_REGEX = /\{\{c(\d+)::([^:]+)(?:::([^}]+))?\}\}/g;

/**
 * Noteee Sector 4 Core TypeScript Interfaces
 * Package: @noteee/core & @noteee/intelligence
 */

// ============================================================================
// 1. EMBEDDER INTERFACE (ONNX Local Vector Generation)
// ============================================================================

export interface EmbeddingResult {
  vector: Float32Array; // 384-dimensional normalized vector
  dimensions: number; // 384
  tokenCount: number; // Number of input tokens processed
  executionTimeMs: number; // Execution duration in milliseconds
}

export interface TokenizerOutput {
  inputIds: Int32Array;
  attentionMask: Int32Array;
  tokenTypeIds: Int32Array;
}

export interface IEmbedder {
  /** Initializes the ONNX runtime model and loads vocabulary into memory */
  initialize(): Promise<void>;
  
  /** Generates a normalized 384-dimensional vector embedding for a given text string */
  generateEmbedding(text: string): Promise<EmbeddingResult>;
  
  /** Generates vector embeddings for a micro-batch of text strings */
  generateBatchEmbeddings(texts: string[]): Promise<EmbeddingResult[]>;
  
  /** Tokenizes raw text into ONNX-compatible input tensors */
  tokenize(text: string, maxLength?: number): Promise<TokenizerOutput>;
  
  /** Releases ONNX runtime session resources and clears LRU caches */
  dispose(): Promise<void>;
}

// ============================================================================
// 2. AI CLASSIFICATION & PLACEMENT ENGINE INTERFACE
// ============================================================================

export interface FolderSuggestion {
  folderId: string;
  folderPath: string;
  folderName: string;
  confidenceScore: number; // 0.0 to 1.0 (Cosine Similarity)
  matchReason: string;
}

export interface NewBranchSuggestion {
  suggestedParentId: string | null;
  suggestedParentPath: string;
  proposedFolderName: string;
  fullProposedPath: string;
  confidenceScore: number;
  reasoning: string;
}

export type PlacementPathway = 
  | { type: 'FALLBACK_DEFAULT'; folderId: string; folderPath: string }
  | { type: 'EXISTING_SUGGESTION'; suggestions: FolderSuggestion[] }
  | { type: 'NEW_BRANCH_CREATION'; suggestion: NewBranchSuggestion };

export interface IClassificationEngine {
  /** Evaluates a note's text and embedding against workspace folders to determine placement pathway */
  evaluatePlacement(noteText: string, noteEmbedding: Float32Array): Promise<PlacementPathway>;
  
  /** Re-calculates and updates the exponential moving average centroid vector for a folder */
  updateFolderVector(folderId: string): Promise<void>;
  
  /** Re-indexes all folder centroid vectors across the workspace */
  reindexWorkspaceVectors(): Promise<void>;
}

// ============================================================================
// 3. UNIFIED HYBRID SEMANTIC SEARCH ENGINE INTERFACE
// ============================================================================

export interface SearchQueryOptions {
  query: string;
  topK?: number; // Maximum results to return (default: 20)
  filterFolderId?: string; // Optional folder scope filter
  filterTags?: string[]; // Optional tag filter array
  includeVault?: boolean; // Requires biometric unlock verification if true
  minScoreThreshold?: number; // Minimum RRF score filter
}

export interface SearchResultItem {
  pageId: string;
  title: string;
  snippet: string;
  folderId: string;
  folderPath: string;
  vectorScore: number; // Cosine similarity score [0.0, 1.0]
  bm25Score: number; // FTS5 BM25 score
  rrfScore: number; // Reciprocal Rank Fusion score
  matchedBlockId?: string;
}

export interface ISemanticSearchEngine {
  /** Executes hybrid vector + FTS5 search combined via Reciprocal Rank Fusion */
  search(options: SearchQueryOptions): Promise<SearchResultItem[]>;
  
  /** Indexes or updates a page's content in both FTS5 tables and vector stores */
  indexPage(pageId: string, title: string, contentBlocks: Array<{ id: string; text: string }>): Promise<void>;
  
  /** Removes a page and its associated vectors/FTS entries from the search index */
  removePageFromIndex(pageId: string): Promise<void>;
}

// ============================================================================
// 4. FSRS SPACED REPETITION SCHEDULER INTERFACE (ts-fsrs v5.0.x)
// ============================================================================

export type FSRSRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy
export type FlashcardState = 'New' | 'Learning' | 'Review' | 'Relearning';

export interface FSRSCard {
  id: string;
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  repetition: number;
  lapses: number;
  state: FlashcardState;
  lastReview?: Date;
}

export interface FSRSReviewLog {
  rating: FSRSRating;
  state: FlashcardState;
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  lastElapsedDays: number;
  scheduledDays: number;
  review: Date;
}

export interface FSRSSchedulingInfo {
  card: FSRSCard;
  log: FSRSReviewLog;
}

export interface FSRSNextSchedules {
  1: FSRSSchedulingInfo; // Again
  2: FSRSSchedulingInfo; // Hard
  3: FSRSSchedulingInfo; // Good
  4: FSRSSchedulingInfo; // Easy
}

export interface IFSRSScheduler {
  /** Computes candidate next scheduling options for all 4 ratings (Again, Hard, Good, Easy) */
  calculateNextSchedules(card: FSRSCard, reviewDate?: Date): FSRSNextSchedules;
  
  /** Processes a user review rating, updating card stability, difficulty, and next due date */
  processReview(card: FSRSCard, rating: FSRSRating, reviewDate?: Date): FSRSSchedulingInfo;
  
  /** Creates a default new card instance initialized with FSRS baseline values */
  createNewCard(id: string): FSRSCard;
}

// ============================================================================
// 5. FLASHCARD GENERATOR INTERFACE (Cloze & AI Q&A)
// ============================================================================

export interface ClozeDeletion {
  index: number; // c1, c2, etc.
  answer: string;
  hint?: string;
  rawText: string;
}

export interface GeneratedQACard {
  front: string;
  back: string;
  sourceBlockId: string;
  confidenceScore: number;
}

export interface IFlashcardGenerator {
  /** Parses text string to extract all Cloze deletions {{c1::answer::hint}} */
  extractClozeDeletions(text: string): ClozeDeletion[];
  
  /** Uses local NLP / ONNX models to auto-generate candidate Q&A cards from page blocks */
  generateQAFromPage(pageId: string, blocks: Array<{ id: string; text: string }>): Promise<GeneratedQACard[]>;
  
  /** Creates a flashcard record in the database from an extracted Cloze deletion */
  createFlashcardFromCloze(pageId: string, blockId: string, cloze: ClozeDeletion): Promise<string>;
}