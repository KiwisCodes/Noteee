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