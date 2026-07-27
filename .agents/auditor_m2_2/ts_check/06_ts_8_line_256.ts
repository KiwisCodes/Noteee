export interface LatexMathBlockContent {
  formula: string; // e.g. "E = mc^2" or "\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
  displayMode: boolean; // true = centered block formula, false = inline formula
}
