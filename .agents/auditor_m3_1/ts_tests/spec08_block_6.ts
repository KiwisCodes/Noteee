export interface CanvasEmbedBlockContent {
  canvasDataId: string; // Foreign key pointing to canvas_documents record
  previewUrl?: string | null; // Base64 or local file URI png thumbnail
  height: number; // Embedded block height (default: 300px)
  readOnly: boolean;
}