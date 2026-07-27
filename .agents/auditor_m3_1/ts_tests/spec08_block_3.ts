export interface OcclusionMask {
  id: string; // Mask UUID
  maskIndex: number; // 1-based mask index (e.g. Mask 1, Mask 2)
  x: number; // Relative X coordinate (0.0 to 1.0 ratio of image width)
  y: number; // Relative Y coordinate (0.0 to 1.0 ratio of image height)
  width: number; // Relative width (0.0 to 1.0)
  height: number; // Relative height (0.0 to 1.0)
  label?: string; // Optional prompt hint / label
  color?: string; // Mask background color (default: "#3B82F6")
}

export type OcclusionMode = 'HIDE_ALL_REVEAL_ONE' | 'HIDE_ONE_REVEAL_ONE';

export interface ImageOcclusionPayload {
  sourceType: 'image_block' | 'pdf_page';
  imageUri: string; // Image file URI or PDF page render snapshot URI
  pdfPageId?: string;
  pdfPageIndex?: number;
  mode: OcclusionMode;
  masks: OcclusionMask[];
  targetMaskId: string; // The active mask being tested for this card
}