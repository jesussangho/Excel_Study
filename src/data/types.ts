export type CategoryId =
  | "basic"
  | "condition"
  | "text"
  | "lookup"
  | "date"
  | "logic"
  | "advanced";

export type Difficulty = "easy" | "medium" | "hard";

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  emoji: string;
  description: string;
}

export interface GuidedCell {
  ref: string;
  label: string;
  defaultValue: string;
  editable: boolean;
}

export interface GuidedWidgetConfig {
  cells: GuidedCell[];
  formula: string;
  resultLabel: string;
  /** Name of a second, read-only reference sheet (e.g. "Sheet2") for lessons
   * like INDIRECT that demonstrate cross-sheet references. */
  otherSheetName?: string;
  otherSheetCells?: GuidedCell[];
}

export interface SheetPreset {
  cells: Record<string, string>;
  cols: string[];
  rows: number;
}

export interface SpreadsheetPreset {
  cells: Record<string, string>;
  hint: string;
  cols: string[];
  rows: number;
  /** Extra named sheets (e.g. { Sheet2: {...} }) shown as tabs alongside the
   * main grid, for lessons that reference another sheet's cells. */
  extraSheets?: Record<string, SheetPreset>;
}

export interface QuizQuestion {
  story: string;
  formulaHint: string;
  answer: string;
  explanation: string;
}

export interface ExcelFunction {
  id: string;
  name: string;
  category: CategoryId;
  difficulty: Difficulty;
  syntax: string;
  kidExplanation: string;
  analogy: string;
  tip: string;
  keywords: string[];
  guided: GuidedWidgetConfig;
  spreadsheet: SpreadsheetPreset;
  quiz: QuizQuestion;
}
