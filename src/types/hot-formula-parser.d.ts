declare module "hot-formula-parser" {
  interface CellRef {
    label: string;
    row: { label: string; index: number };
    column: { label: string; index: number };
  }

  interface ParseResult {
    result: unknown;
    error: string | null;
  }

  export class Parser {
    on(
      event: "callCellValue",
      handler: (cellCoord: CellRef, done: (value: unknown) => void) => void,
    ): void;
    on(
      event: "callRangeValue",
      handler: (start: CellRef, end: CellRef, done: (value: unknown[][]) => void) => void,
    ): void;
    setFunction(name: string, fn: (params: unknown[]) => unknown): void;
    parse(formula: string): ParseResult;
  }
}
