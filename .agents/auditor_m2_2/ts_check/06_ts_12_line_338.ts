export interface CanvasEmbedBlockContent {
  canvasDataId: string; // References stroke vector record in Sector 5 database
  previewUrl?: string | null; // Cached PNG/SVG thumbnail preview URI
  height: number; // Viewport block height (default: 300px)
  readOnly: boolean;
}
