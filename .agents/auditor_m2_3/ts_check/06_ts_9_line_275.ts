export interface ImageEmbedBlockContent {
  url: string; // Local file URI (file://...) or HTTPS cloud URL
  caption?: string | null;
  altText?: string | null;
  width?: number | null; // Display width in pixels or percentage
  height?: number | null;
}
