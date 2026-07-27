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