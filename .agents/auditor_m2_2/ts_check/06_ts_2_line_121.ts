export interface TextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  link?: string | null;
  color?: string | null;
}

export interface ParagraphBlockContent {
  spans: TextSpan[];
}
