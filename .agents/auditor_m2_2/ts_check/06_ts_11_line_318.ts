export interface SubpageLinkBlockContent {
  targetPageId: string; // Target page UUID in pages table
  title: string; // Target page title snapshot
  icon?: string | null; // Target page emoji icon
}
