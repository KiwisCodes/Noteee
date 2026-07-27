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
