// PDF Text Quadpoint Alignment Schema
export interface PDFTextQuadpoint {
  x1: number; // Top-Left X (PDF points, 72 DPI)
  y1: number; // Top-Left Y
  x2: number; // Top-Right X
  y2: number; // Top-Right Y
  x3: number; // Bottom-Left X
  y3: number; // Bottom-Left Y
  x4: number; // Bottom-Right X
  y4: number; // Bottom-Right Y
}

export interface PDFTextHighlightAnnotation {
  id: string; // UUID v4
  pageIndex: number; // 0-based PDF page index
  textQuote: string; // Extracted raw text string
  quadpoints: PDFTextQuadpoint[];
  color: string; // Hex color (e.g., "#FDE047" yellow, "#86EFAC" green)
  style: 'highlight' | 'underline' | 'strikethrough';
  createdAt: string;
}