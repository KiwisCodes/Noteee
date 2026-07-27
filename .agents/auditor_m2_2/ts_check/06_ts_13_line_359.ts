export interface FlashcardClozeBlockContent {
  cardType: 'cloze' | 'qa';
  frontText: string; // Question text or sentence containing {{c1::answer::hint}}
  backText?: string | null; // Answer text for QA type cards
  deckCategory?: string | null;
  fsrsState?: {
    stability: number;
    difficulty: number;
    due: string; // ISO-8601 YYYY-MM-DD
    reps: number;
  } | null;
}
