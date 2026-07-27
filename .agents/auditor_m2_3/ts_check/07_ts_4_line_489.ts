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
