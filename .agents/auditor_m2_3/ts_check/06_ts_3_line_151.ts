export interface HeadingBlockContent {
  level: 1 | 2 | 3;
  spans: TextSpan[];
  isCollapsed?: boolean; // Toggles folding of subordinate child blocks
}
