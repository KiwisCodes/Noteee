/**
 * Noteee Sector 5 Core TypeScript Interfaces
 * Package: @noteee/canvas & @noteee/pdf
 */

import { Matrix2D } from './matrix-2d';

// ============================================================================
// 1. STROKE DATA MODELS & MANAGER INTERFACE
// ============================================================================

export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export type CanvasToolType = 'pen' | 'pencil' | 'highlighter' | 'eraser' | 'lasso';

export interface CanvasStrokeStyle {
  toolType: CanvasToolType;
  color: string; // Hex color string
  size: number; // Base stroke width
  opacity: number; // 0.0 to 1.0
  blendMode: 'SrcOver' | 'Multiply' | 'Clear';
  strokeCap: 'round' | 'butt' | 'square';
  strokeJoin: 'round' | 'bevel' | 'miter';
}

export interface CanvasStrokeData {
  id: string;
  canvasId: string;
  layerId: string;
  style: CanvasStrokeStyle;
  points: StrokePoint[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  createdAt: string;
}

export interface IStrokeManager {
  /** Starts a new stroke buffer with initial touch point */
  beginStroke(layerId: string, style: CanvasStrokeStyle, startPoint: StrokePoint): void;
  
  /** Appends streaming touch point to active in-flight stroke */
  appendPoint(point: StrokePoint): void;
  
  /** Finalizes stroke, runs RDP simplification, and persists stroke to SQLite */
  endStroke(): Promise<CanvasStrokeData>;
  
  /** Erases all strokes intersecting a given spatial boundary */
  eraseStrokesAt(layerId: string, erasePoint: { x: number; y: number }, radius: number): Promise<string[]>; // Returns erased stroke IDs
  
  /** Retrieves all strokes belonging to visible spatial grid chunks within a viewport bounding box */
  getVisibleStrokes(canvasId: string, viewportBounds: { minX: number; minY: number; maxX: number; maxY: number }): Promise<CanvasStrokeData[]>;
}

// ============================================================================
// 2. SKIA GPU CANVAS RENDERER INTERFACE
// ============================================================================

export interface RenderViewportConfig {
  width: number; // Viewport width in screen pixels
  height: number; // Viewport height in screen pixels
  matrix: Matrix2D; // Active 2D affine transformation matrix
  pixelRatio: number; // Device pixel ratio (e.g. 2.0 or 3.0)
}

export interface ICanvasRenderer {
  /** Initializes Skia GPU rendering surface */
  initializeSurface(width: number, height: number): Promise<void>;
  
  /** Updates view transform matrix for scaling and panning */
  setTransformMatrix(matrix: Matrix2D): void;
  
  /** Renders a complete frame containing all active layers and visible strokes */
  renderFrame(strokes: CanvasStrokeData[], activeStroke?: CanvasStrokeData): void;
  
  /** Encodes current canvas surface into a PNG thumbnail image string (Base64 URI) */
  exportThumbnail(maxWidth?: number, maxHeight?: number): Promise<string>;
  
  /** Releases Skia GPU surface buffers and native memory resources */
  dispose(): void;
}

// ============================================================================
// 3. PDF ANNOTATION ENGINE INTERFACE
// ============================================================================

export interface PDFSelectionRange {
  pageIndex: number;
  startOffset: number;
  endOffset: number;
}

export interface PDFTextQuadpoint {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  x4: number;
  y4: number;
}

export interface PDFHighlightRequest {
  pageId: string;
  pdfSourceUri: string;
  pageIndex: number;
  textQuote: string;
  quadpoints: PDFTextQuadpoint[];
  color: string;
  style: 'highlight' | 'underline' | 'strikethrough';
}

export interface IPDFAnnotationEngine {
  /** Loads PDF document via pdfjs-dist worker for text & geometry parsing */
  loadDocument(pdfSourceUri: string): Promise<{ totalPages: number }>;
  
  /** Extracts text quadpoints for a user-selected text range on a PDF page */
  getTextQuadpoints(pageIndex: number, selection: PDFSelectionRange): Promise<PDFTextQuadpoint[]>;
  
  /** Adds a text highlight annotation over PDF text and persists to SQLite */
  addTextHighlight(request: PDFHighlightRequest): Promise<string>; // Returns annotation ID
  
  /** Attaches freehand ink stroke markup over a specific PDF page */
  addFreehandMarkup(pageIndex: number, strokeData: CanvasStrokeData): Promise<void>;
  
  /** Fetches all text highlights and ink annotations for a specific PDF page */
  getPageAnnotations(pdfSourceUri: string, pageIndex: number): Promise<unknown[]>;
}

// ============================================================================
// 4. IMAGE OCCLUSION CARD GENERATOR INTERFACE
// ============================================================================

export interface CreateOcclusionMaskParams {
  pageId: string;
  sourceBlockId?: string;
  imageUri: string;
  pdfPageId?: string;
  pdfPageIndex?: number;
  mode: 'HIDE_ALL_REVEAL_ONE' | 'HIDE_ONE_REVEAL_ONE';
  masks: Array<{
    maskIndex: number;
    relX: number;
    relY: number;
    relWidth: number;
    relHeight: number;
    label?: string;
    color?: string;
  }>;
}

export interface IOcclusionCardGenerator {
  /** Creates an Image Occlusion suite and generates corresponding Sector 4 FSRS flashcard records */
  createOcclusionSuite(params: CreateOcclusionMaskParams): Promise<{ createdCardIds: string[] }>;
  
  /** Updates existing occlusion mask coordinates or mode */
  updateOcclusionMask(cardId: string, maskId: string, updatedMask: Partial<CreateOcclusionMaskParams['masks'][0]>): Promise<void>;
  
  /** Renders occlusion masks over a source image view during study review session */
  renderOcclusionOverlay(imageUri: string, masks: CreateOcclusionMaskParams['masks'], targetMaskId: string, isAnswerRevealed: boolean): JSX.Element;
}