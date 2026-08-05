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
}

export interface SpreadsheetPreset {
  cells: Record<string, string>;
  hint: string;
  cols: string[];
  rows: number;
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
