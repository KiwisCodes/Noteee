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
