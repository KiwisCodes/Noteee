export interface CodeBlockContent {
  code: string;
  language: string; // e.g. 'typescript', 'python', 'sql', 'json', 'html', 'css', 'bash'
  caption?: string | null;
  showLineNumbers?: boolean;
}
