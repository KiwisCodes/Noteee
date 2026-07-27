// --- 05_sector_2_capture_spec.md ---
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

// Discriminated Payload Union for capture_sessions.sessionData

export interface PhotoSessionData {
  modality: 'photo';
  imageUri: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  ocrExtractedText?: string | null;
  draftBlocks: DraftBlock[];
}

export interface MultiPhotoSessionData {
  modality: 'multi_photo';
  photos: Array<{
    id: string;
    imageUri: string;
    orderIndex: number;
    width: number;
    height: number;
    rotationDegrees: number;
    ocrExtractedText?: string | null;
  }>;
  draftBlocks: DraftBlock[];
}

export interface AudioSessionData {
  modality: 'audio';
  audioFilePath: string;
  durationSeconds: number;
  sampleRate: number;
  channels: number;
  fullTranscript: string;
  transcriptChunks: Array<{
    startTimeMs: number;
    endTimeMs: number;
    text: string;
    confidence: number;
  }>;
  draftBlocks: DraftBlock[];
}

export interface TextSessionData {
  modality: 'text';
  rawInputText: string;
  detectedTags: string[];
  detectedDueDate?: string | null;
  draftBlocks: DraftBlock[];
}

export interface ClipboardSessionData {
  modality: 'clipboard';
  copiedContent: string;
  contentType: 'url' | 'code' | 'text' | 'vault_credential' | 'image';
  sourceApp?: string | null;
  draftBlocks: DraftBlock[];
}

export interface ScreenSessionData {
  modality: 'screen';
  screenshotUri: string;
  windowTitle?: string | null;
  ocrExtractedText?: string | null;
  draftBlocks: DraftBlock[];
}

export interface MultiModalSessionData {
  modality: 'multi_modal';
  photoData?: MultiPhotoSessionData | null;
  audioData?: AudioSessionData | null;
  textData?: TextSessionData | null;
  clipboardData?: ClipboardSessionData | null;
  consolidatedTranscript: string;
  draftBlocks: DraftBlock[];
}

export type CaptureSessionDataPayload =
  | PhotoSessionData
  | MultiPhotoSessionData
  | AudioSessionData
  | TextSessionData
  | ClipboardSessionData
  | ScreenSessionData
  | MultiModalSessionData;

// Intermediate Draft Block Schema before committing to Layer 1 `blocks` table
export interface DraftBlock {
  tempId: string;
  type: 'paragraph' | 'heading' | 'todo_item' | 'code_block' | 'image_embed' | 'quote';
  orderIndex: number;
  content: Record<string, any>;
}

/**
 * Noteee Sector 2: Multi-Modal Capture Engine Interfaces
 * Path: packages/core/src/capture/interfaces.ts
 */

// ============================================================================
// 1. Enums & Base Types
// ============================================================================

export type CaptureModality =
  | 'photo'
  | 'multi_photo'
  | 'audio'
  | 'text'
  | 'clipboard'
  | 'screen'
  | 'multi_modal';

export type CaptureSessionState =
  | 'IDLE'
  | 'RECORDING'
  | 'PROCESSING'
  | 'SUGGESTION'
  | 'FILED'
  | 'CANCELLED';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface CaptureSourceMetadata {
  modality: CaptureModality;
  deviceId?: string;
  location?: LocationCoordinates;
  timestamp: string; // ISO-8601
}

export interface RawCapturePayload {
  sourceMetadata: CaptureSourceMetadata;
  binaryPaths?: string[];
  textPayload?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// 2. ICaptureSource Strategy Interface
// ============================================================================

export interface ICaptureSource {
  readonly modality: CaptureModality;
  readonly isAvailable: boolean;

  initialize(): Promise<void>;
  startCapture(options?: Record<string, any>): Promise<void>;
  pauseCapture?(): Promise<void>;
  resumeCapture?(): Promise<void>;
  stopCapture(): Promise<RawCapturePayload>;
  dispose(): Promise<void>;
}

// ============================================================================
// 3. ICaptureSessionManager Interface
// ============================================================================

export interface CaptureSession {
  id: string; // UUID v4
  status: CaptureSessionState;
  mediaType: CaptureModality;
  targetFolderId: string | null;
  targetPageId: string | null;
  sessionData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ICaptureSessionManager {
  readonly activeSession: CaptureSession | null;
  readonly currentState: CaptureSessionState;

  startSession(modality: CaptureModality, options?: Record<string, any>): Promise<CaptureSession>;
  appendMediaChunk(sessionId: string, chunk: RawCapturePayload): Promise<CaptureSession>;
  pauseSession(sessionId: string): Promise<void>;
  resumeSession(sessionId: string): Promise<void>;
  stopCaptureAndProcess(sessionId: string): Promise<CaptureSession>;
  confirmPlacement(sessionId: string, targetFolderId: string, targetPageId?: string): Promise<string>; // Returns Page ID
  cancelSession(sessionId: string): Promise<void>;
  recoverOrphanSessions(): Promise<CaptureSession[]>;
  subscribe(observer: ICaptureEventObserver): () => void; // Unsubscribe function
}

// ============================================================================
// 4. ISuggestionEngine Interface
// ============================================================================

export interface FolderSuggestion {
  folderId: string;
  folderName: string;
  folderPath: string;
  confidenceScore: number; // 0.0 to 1.0
  reasoning: string;
}

export interface PlacementSuggestions {
  sessionId: string;
  topFolders: FolderSuggestion[];
  suggestNewBranch: boolean;
  proposedBranchPath?: string;
  suggestedTags: string[];
}

export interface ISuggestionEngine {
  evaluateSession(session: CaptureSession): Promise<PlacementSuggestions>;
}

// ============================================================================
// 5. ILiveActivityBridge Interface (ActivityKit Integration)
// ============================================================================

export interface LiveActivityAttributes {
  sessionId: string;
  mediaType: CaptureModality;
  title: string;
}

export interface LiveActivityState {
  statusText: string;
  durationSeconds: number;
  itemCount: number;
  previewSnippet?: string;
  isPaused: boolean;
}

export interface ILiveActivityBridge {
  isSupported(): boolean;
  startActivity(attributes: LiveActivityAttributes, initialState: LiveActivityState): Promise<string>; // Returns activityId
  updateActivity(sessionId: string, updatedState: LiveActivityState): Promise<void>;
  endActivity(sessionId: string, finalState?: LiveActivityState, dismissImmediately?: boolean): Promise<void>;
}

// ============================================================================
// 6. IWhisperEngine Interface (Offline Speech-to-Text)
// ============================================================================

export interface WhisperConfig {
  modelPath: string;
  language: string; // e.g. 'en'
  translate: boolean;
  voiceActivityDetection: boolean;
}

export interface WhisperChunk {
  startTimeMs: number;
  endTimeMs: number;
  text: string;
  confidence: number;
}

export interface WhisperTranscriptionResult {
  fullText: string;
  segments: WhisperChunk[];
  detectedLanguage: string;
  durationMs: number;
}

export interface IWhisperEngine {
  loadModel(config: WhisperConfig): Promise<void>;
  transcribeAudioFile(filePath: string): Promise<WhisperTranscriptionResult>;
  startRealtimeStream(onChunk: (chunk: WhisperChunk) => void): Promise<void>;
  stopRealtimeStream(): Promise<WhisperTranscriptionResult>;
  release(): Promise<void>;
}

// ============================================================================
// 7. IClipboardDetector Interface
// ============================================================================

export type ClipboardContentType = 'url' | 'code' | 'text' | 'vault_credential' | 'image';

export interface ClipboardItem {
  content: string;
  type: ClipboardContentType;
  contentHash: string; // SHA-256
  timestamp: string;
}

export interface IClipboardDetector {
  checkClipboard(): Promise<ClipboardItem | null>;
  markProcessed(contentHash: string): Promise<void>;
}

// ============================================================================
// 8. ITextToSpeechEngine Interface
// ============================================================================

export interface TTSOptions {
  rate?: number; // 0.5 to 2.0
  pitch?: number; // 0.5 to 1.5
  language?: string; // e.g. 'en-US'
  voiceId?: string;
}

export type TTSState = 'IDLE' | 'PLAYING' | 'PAUSED';

export interface ITextToSpeechEngine {
  readonly state: TTSState;
  speak(text: string, options?: TTSOptions): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  onBoundary(callback: (event: { charIndex: number; charLength: number }) => void): () => void;
}

// ============================================================================
// 9. ICaptureEventObserver Interface (Pub/Sub)
// ============================================================================

export interface CaptureEvent {
  type:
    | 'SESSION_STARTED'
    | 'CHUNK_APPENDED'
    | 'STATE_CHANGED'
    | 'TRANSCRIPTION_UPDATED'
    | 'SUGGESTIONS_READY'
    | 'SESSION_FILED'
    | 'SESSION_CANCELLED';
  sessionId: string;
  state: CaptureSessionState;
  payload?: any;
  timestamp: string;
}

export interface ICaptureEventObserver {
  onCaptureEvent(event: CaptureEvent): void;
}

// --- 06_sector_3_editor_spec.md ---
export interface RPCMessage<T = unknown> {
  id: string; // UUID v4 for request/response tracking
  type: 'REQUEST' | 'RESPONSE' | 'EVENT';
  method: string; // RPC method name (e.g., 'editor:loadDocument', 'editor:onTransaction')
  payload: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number; // UTC Epoch Unix MS
}

export interface TextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  link?: string | null;
  color?: string | null;
}

export interface ParagraphBlockContent {
  spans: TextSpan[];
}

export interface HeadingBlockContent {
  level: 1 | 2 | 3;
  spans: TextSpan[];
  isCollapsed?: boolean; // Toggles folding of subordinate child blocks
}

export interface TodoItemBlockContent {
  spans: TextSpan[];
  checked: boolean;
  dueDate: string | null; // ISO-8601 YYYY-MM-DD
  assignee?: string | null;
}

export interface ToggleListBlockContent {
  spans: TextSpan[];
  isExpanded: boolean;
}

export interface CalloutBlockContent {
  spans: TextSpan[];
  icon: string; // Emoji character or Lucide icon identifier (default: "💡")
  color: 'info' | 'warning' | 'success' | 'error' | 'neutral'; // Preset accent themes
}

export interface CodeBlockContent {
  code: string;
  language: string; // e.g. 'typescript', 'python', 'sql', 'json', 'html', 'css', 'bash'
  caption?: string | null;
  showLineNumbers?: boolean;
}

export interface LatexMathBlockContent {
  formula: string; // e.g. "E = mc^2" or "\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
  displayMode: boolean; // true = centered block formula, false = inline formula
}

export interface ImageEmbedBlockContent {
  url: string; // Local file URI (file://...) or HTTPS cloud URL
  caption?: string | null;
  altText?: string | null;
  width?: number | null; // Display width in pixels or percentage
  height?: number | null;
}

export interface AudioPlayerBlockContent {
  url: string; // Local audio file URI (.m4a, .mp3, .wav)
  duration: number; // Duration in seconds
  transcript?: string | null; // Whisper STT transcribed text payload
  playbackSpeed?: number; // Default 1.0 (supports 1.0, 1.25, 1.5, 2.0)
}

export interface SubpageLinkBlockContent {
  targetPageId: string; // Target page UUID in pages table
  title: string; // Target page title snapshot
  icon?: string | null; // Target page emoji icon
}

export interface CanvasEmbedBlockContent {
  canvasDataId: string; // References stroke vector record in Sector 5 database
  previewUrl?: string | null; // Cached PNG/SVG thumbnail preview URI
  height: number; // Viewport block height (default: 300px)
  readOnly: boolean;
}

export interface FlashcardClozeBlockContent {
  cardType: 'cloze' | 'qa';
  frontText: string; // Question text or sentence containing {{c1::answer::hint}}
  backText?: string | null; // Answer text for QA type cards
  deckCategory?: string | null;
  fsrsState?: {
    stability: number;
    difficulty: number;
    due: string; // ISO-8601 YYYY-MM-DD
    reps: number;
  } | null;
}

export interface EditorSelectionState {
  anchorBlockId: string;
  anchorOffset: number;
  headBlockId: string;
  headOffset: number;
}

// Yjs Document Structure for a Noteee Page
const ydoc = new Y.Doc();
const xmlFragment = ydoc.getXmlFragment('prosemirror');

import { Collaboration } from '@tiptap/extension-collaboration';

const editor = new Editor({
  extensions: [
    Collaboration.configure({
      document: ydoc,
      field: 'prosemirror',
    }),
  ],
});

export interface YjsAwarenessState {
  clientHolderId: number; // Unique Yjs client ID
  user: {
    name: string;
    avatarUrl?: string;
    color: string; // Distinct cursor highlight hex color (e.g. "#FF5733")
  };
  cursor: {
    anchorBlockId: string;
    anchorOffset: number;
    headBlockId: string;
    headOffset: number;
  } | null;
}

import { ReactNode } from 'react';

// ============================================================================
// 1. Block Payload & Content Interfaces
// ============================================================================

export type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'todo_item'
  | 'toggle'
  | 'callout'
  | 'code_block'
  | 'latex_math'
  | 'image'
  | 'audio'
  | 'subpage_link'
  | 'canvas_embed'
  | 'flashcard_cloze';

export interface TextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  link?: string | null;
  color?: string | null;
}

export interface ParagraphBlockContent { spans: TextSpan[]; }
export interface HeadingBlockContent { level: 1 | 2 | 3; spans: TextSpan[]; isCollapsed?: boolean; }
export interface TodoItemBlockContent { spans: TextSpan[]; checked: boolean; dueDate: string | null; assignee?: string | null; }
export interface ToggleListBlockContent { spans: TextSpan[]; isExpanded: boolean; }
export interface CalloutBlockContent { spans: TextSpan[]; icon: string; color: 'info' | 'warning' | 'success' | 'error' | 'neutral'; }
export interface CodeBlockContent { code: string; language: string; caption?: string | null; showLineNumbers?: boolean; }
export interface LatexMathBlockContent { formula: string; displayMode: boolean; }
export interface ImageEmbedBlockContent { url: string; caption?: string | null; altText?: string | null; width?: number | null; height?: number | null; }
export interface AudioPlayerBlockContent { url: string; duration: number; transcript?: string | null; playbackSpeed?: number; }
export interface SubpageLinkBlockContent { targetPageId: string; title: string; icon?: string | null; }
export interface CanvasEmbedBlockContent { canvasDataId: string; previewUrl?: string | null; height: number; readOnly: boolean; }
export interface FlashcardClozeBlockContent { cardType: 'cloze' | 'qa'; frontText: string; backText?: string | null; deckCategory?: string | null; }

export type BlockContentPayload =
  | ParagraphBlockContent
  | HeadingBlockContent
  | TodoItemBlockContent
  | ToggleListBlockContent
  | CalloutBlockContent
  | CodeBlockContent
  | LatexMathBlockContent
  | ImageEmbedBlockContent
  | AudioPlayerBlockContent
  | SubpageLinkBlockContent
  | CanvasEmbedBlockContent
  | FlashcardClozeBlockContent;

export interface BlockRecord {
  id: string;
  pageId: string;
  parentBlockId: string | null;
  type: BlockType;
  orderIndex: number;
  content: BlockContentPayload;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 2. IBlockRenderer Interface
// ============================================================================

export interface BlockRendererProps<T extends BlockContentPayload = BlockContentPayload> {
  block: BlockRecord;
  content: T;
  isFocused: boolean;
  readOnly: boolean;
  onUpdateContent: (updatedContent: Partial<T>) => void;
  onDeleteBlock: (blockId: string) => void;
}

export interface IBlockRenderer<T extends BlockContentPayload = BlockContentPayload> {
  type: BlockType;
  name: string;
  icon: string;
  renderComponent: (props: BlockRendererProps<T>) => ReactNode;
  toProseMirrorNodeSchema: () => Record<string, unknown>;
  validatePayload: (payload: unknown) => payload is T;
}

// ============================================================================
// 3. ITipTapBridge Interface
// ============================================================================

export interface RPCMessage<T = unknown> {
  id: string;
  type: 'REQUEST' | 'RESPONSE' | 'EVENT';
  method: string;
  payload: T;
  error?: { code: string; message: string };
  timestamp: number;
}

export type BridgeEventHandler<T = unknown> = (payload: T) => void;

export interface ITipTapBridge {
  isReady: boolean;
  initialize: (webViewRef: unknown) => Promise<void>;
  sendRPCRequest: <TReq, TRes>(method: string, payload: TReq) => Promise<TRes>;
  subscribeEvent: <TPayload>(event: string, handler: BridgeEventHandler<TPayload>) => () => void;
  loadDocument: (pageId: string, blocks: BlockRecord[]) => Promise<void>;
  focusEditor: (blockId?: string) => Promise<void>;
  blurEditor: () => Promise<void>;
  dispose: () => void;
}

// ============================================================================
// 4. ISlashCommandRegistry Interface
// ============================================================================

export interface SlashCommandContext {
  editorBridge: ITipTapBridge;
  activeBlockId: string;
  query: string;
}

export interface SlashCommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Basic Text' | 'Lists & Container' | 'Code & Math' | 'Media & Embeds' | 'Interactive';
  keywords: string[];
  icon: string;
  execute: (context: SlashCommandContext) => void | Promise<void>;
}

export interface ISlashCommandRegistry {
  registerCommand: (command: SlashCommandItem) => void;
  unregisterCommand: (commandId: string) => void;
  searchCommands: (query: string) => SlashCommandItem[];
  getAllCommands: () => SlashCommandItem[];
}

// ============================================================================
// 5. ICommandHistoryManager Interface
// ============================================================================

export interface EditorSelectionState {
  anchorBlockId: string;
  anchorOffset: number;
  headBlockId: string;
  headOffset: number;
}

export interface TransactionStep {
  id: string;
  timestamp: number;
  description: string;
  beforeBlocks: BlockRecord[];
  afterBlocks: BlockRecord[];
  selectionBefore: EditorSelectionState | null;
  selectionAfter: EditorSelectionState | null;
}

export interface ICommandHistoryManager {
  canUndo: boolean;
  canRedo: boolean;
  recordStep: (step: Omit<TransactionStep, 'id' | 'timestamp'>) => void;
  undo: () => TransactionStep | null;
  redo: () => TransactionStep | null;
  clearHistory: () => void;
}

// ============================================================================
// 6. IYjsSyncProvider Interface
// ============================================================================

export interface YjsAwarenessUser {
  name: string;
  avatarUrl?: string;
  color: string;
}

export interface YjsAwarenessState {
  clientId: number;
  user: YjsAwarenessUser;
  cursor: EditorSelectionState | null;
}

export interface SyncStatusEvent {
  status: 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'SYNCED' | 'ERROR';
  error?: string;
}

export interface IYjsSyncProvider {
  isConnected: boolean;
  syncStatus: SyncStatusEvent['status'];
  connect: (documentId: string, websocketUrl: string) => void;
  disconnect: () => void;
  setAwarenessCursor: (cursor: EditorSelectionState | null) => void;
  onSyncStatusChange: (handler: (status: SyncStatusEvent) => void) => () => void;
  onAwarenessChange: (handler: (states: YjsAwarenessState[]) => void) => () => void;
}

// --- 07_sector_4_ai_flashcards_spec.md ---
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

