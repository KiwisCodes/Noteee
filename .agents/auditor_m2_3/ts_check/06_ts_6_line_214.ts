export interface CalloutBlockContent {
  spans: TextSpan[];
  icon: string; // Emoji character or Lucide icon identifier (default: "💡")
  color: 'info' | 'warning' | 'success' | 'error' | 'neutral'; // Preset accent themes
}
