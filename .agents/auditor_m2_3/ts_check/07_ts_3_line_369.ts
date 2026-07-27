// Regex for parsing cloze deletions: {{c1::answer::hint}}
export const CLOZE_REGEX = /\{\{c(\d+)::([^:]+)(?:::([^}]+))?\}\}/g;
