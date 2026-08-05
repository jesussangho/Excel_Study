import { Parser } from "hot-formula-parser";

export interface EvalResult {
  value: string;
  isError: boolean;
}

function colLetterToIndex(letter: string): number {
  let result = 0;
  for (let i = 0; i < letter.length; i++) {
    result = result * 26 + (letter.toUpperCase().charCodeAt(i) - 64);
  }
  return result - 1;
}

function indexToColLetter(index: number): string {
  let n = index + 1;
  let letter = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
}

type Sheet = Record<string, string>;

function resolveCell(raw: string | undefined): number | string {
  if (raw === undefined || raw.trim() === "") return "";
  if (raw.trim().startsWith("=")) {
    // Only used for range/cell lookups; formulas inside referenced cells
    // are resolved lazily by the caller's parser via recursion.
    return raw;
  }
  const num = Number(raw);
  return Number.isNaN(num) ? raw : num;
}

function createParser(sheet: Sheet): Parser {
  const parser = new Parser();

  parser.on("callCellValue", (cellCoord, done) => {
    const label = `${cellCoord.column.label}${cellCoord.row.label}`;
    const raw = sheet[label];
    if (raw !== undefined && raw.trim().startsWith("=")) {
      const { result, error } = parser.parse(raw.trim().slice(1));
      done(error ? "" : result);
      return;
    }
    done(resolveCell(raw));
  });

  parser.on("callRangeValue", (start, end, done) => {
    const result: unknown[][] = [];
    for (let r = start.row.index; r <= end.row.index; r++) {
      const rowValues: unknown[] = [];
      for (let c = start.column.index; c <= end.column.index; c++) {
        const label = `${indexToColLetter(c)}${r + 1}`;
        const raw = sheet[label];
        if (raw !== undefined && raw.trim().startsWith("=")) {
          const { result: nested, error } = parser.parse(raw.trim().slice(1));
          rowValues.push(error ? "" : nested);
        } else {
          rowValues.push(resolveCell(raw));
        }
      }
      result.push(rowValues);
    }
    done(result);
  });

  // VLOOKUP, INDEX and MATCH are implemented in the library's formula
  // module but are not registered in its grammar's supported-function list,
  // so the parser rejects them with #NAME?/#ERROR! before ever calling the
  // implementation. Registering them as custom functions works around that.
  parser.setFunction("VLOOKUP", (params: unknown[]) => {
    const [lookupValue, table] = params;
    const colIndex = params[2] as number;
    if (!Array.isArray(table)) return "#N/A";
    const row = (table as unknown[][]).find((r) => String(r[0]) === String(lookupValue));
    if (!row) return "#N/A";
    return row[colIndex - 1] ?? "#N/A";
  });

  parser.setFunction("INDEX", (params: unknown[]) => {
    const [table, rowIndex, colIndex] = params as [unknown[][], number, number | undefined];
    if (!Array.isArray(table)) return "#N/A";
    const row = table[rowIndex - 1];
    if (!row) return "#N/A";
    return row[(colIndex ?? 1) - 1] ?? "#N/A";
  });

  parser.setFunction("MATCH", (params: unknown[]) => {
    const [lookupValue, lookupArray] = params;
    const flat = flattenRange(lookupArray);
    const idx = flat.findIndex((v) => String(v) === String(lookupValue));
    return idx === -1 ? "#N/A" : idx + 1;
  });

  parser.setFunction("HLOOKUP", (params: unknown[]) => {
    const [lookupValue, table, rowIndex, rangeLookup] = params;
    if (!Array.isArray(table) || table.length === 0) return "#N/A";
    const topRow = table[0] as unknown[];
    let colIdx = -1;
    if (rangeLookup === false || rangeLookup === 0) {
      colIdx = topRow.findIndex((v) => String(v) === String(lookupValue));
    } else {
      for (let i = 0; i < topRow.length; i++) {
        if (Number(topRow[i]) <= Number(lookupValue)) colIdx = i;
        else break;
      }
    }
    if (colIdx === -1) return "#N/A";
    const row = table[(rowIndex as number) - 1] as unknown[] | undefined;
    if (!row) return "#N/A";
    return row[colIdx] ?? "#N/A";
  });

  // hot-formula-parser's built-in SUMIF only accepts 2 args and forces the
  // criteria range to be numeric, so Excel's 3-arg SUMIF(range, criteria,
  // sum_range) needs a custom implementation here.
  parser.setFunction("SUMIF", (params: unknown[]) => {
    const [criteriaRangeRaw, criteria, sumRangeRaw] = params;
    const criteriaFlat = flattenRange(criteriaRangeRaw);
    const sumFlat = sumRangeRaw !== undefined ? flattenRange(sumRangeRaw) : criteriaFlat;
    let result = 0;
    for (let i = 0; i < criteriaFlat.length; i++) {
      if (matchesCriteria(criteriaFlat[i], criteria)) {
        const num = Number(sumFlat[i]);
        if (!Number.isNaN(num)) result += num;
      }
    }
    return result;
  });

  // hot-formula-parser's built-in SUMIFS/AVERAGEIFS mis-pair their range and
  // criteria arguments internally and return garbage results, so both need
  // a custom implementation. COUNTIFS is correctly implemented upstream and
  // is left alone.
  parser.setFunction("SUMIFS", (params: unknown[]) => {
    const [sumRangeRaw, ...criteriaArgs] = params;
    const sumFlat = flattenRange(sumRangeRaw);
    const mask = criteriaMask(sumFlat.length, criteriaArgs);
    let result = 0;
    for (let i = 0; i < sumFlat.length; i++) {
      if (mask[i]) {
        const num = Number(sumFlat[i]);
        if (!Number.isNaN(num)) result += num;
      }
    }
    return result;
  });

  parser.setFunction("AVERAGEIFS", (params: unknown[]) => {
    const [avgRangeRaw, ...criteriaArgs] = params;
    const avgFlat = flattenRange(avgRangeRaw);
    const mask = criteriaMask(avgFlat.length, criteriaArgs);
    let sum = 0;
    let count = 0;
    for (let i = 0; i < avgFlat.length; i++) {
      if (mask[i]) {
        const num = Number(avgFlat[i]);
        if (!Number.isNaN(num)) {
          sum += num;
          count++;
        }
      }
    }
    return count === 0 ? "#DIV/0!" : sum / count;
  });

  // INDIRECT needs to resolve a cell address that only exists as a plain
  // string value once arguments are evaluated, so it reads directly from
  // the closed-over sheet instead of relying on callCellValue.
  parser.setFunction("INDIRECT", (params: unknown[]) => {
    const ref = String(params[0] ?? "")
      .trim()
      .toUpperCase();
    const raw = sheet[ref];
    if (raw !== undefined && raw.trim().startsWith("=")) {
      const { result, error } = parser.parse(raw.trim().slice(1));
      return error ? "#REF!" : result;
    }
    return resolveCell(raw);
  });

  return parser;
}

function criteriaMask(length: number, criteriaArgs: unknown[]): boolean[] {
  const mask = new Array(length).fill(true) as boolean[];
  for (let i = 0; i < criteriaArgs.length; i += 2) {
    const rangeFlat = flattenRange(criteriaArgs[i]);
    const criteria = criteriaArgs[i + 1];
    for (let j = 0; j < length; j++) {
      if (!matchesCriteria(rangeFlat[j], criteria)) mask[j] = false;
    }
  }
  return mask;
}

function flattenRange(value: unknown): unknown[] {
  if (Array.isArray(value)) return value.flat(Infinity as never) as unknown[];
  return [value];
}

function matchesCriteria(value: unknown, criteria: unknown): boolean {
  if (criteria === undefined || criteria === "*") return true;
  const criteriaStr = String(criteria);
  const match = /^(<>|>=|<=|>|<|=)?(.*)$/.exec(criteriaStr);
  const op = match?.[1] ?? "=";
  const target = match?.[2] ?? criteriaStr;
  const numTarget = Number(target);
  const numValue = Number(value);
  const bothNumeric = target.trim() !== "" && !Number.isNaN(numTarget) && !Number.isNaN(numValue);

  switch (op) {
    case ">":
      return bothNumeric ? numValue > numTarget : String(value) > target;
    case "<":
      return bothNumeric ? numValue < numTarget : String(value) < target;
    case ">=":
      return bothNumeric ? numValue >= numTarget : String(value) >= target;
    case "<=":
      return bothNumeric ? numValue <= numTarget : String(value) <= target;
    case "<>":
      return bothNumeric ? numValue !== numTarget : String(value) !== target;
    default:
      return bothNumeric ? numValue === numTarget : String(value) === target;
  }
}

function splitTopLevelArgs(argsStr: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let inQuotes = false;
  let current = "";
  for (const ch of argsStr) {
    if (ch === '"') inQuotes = !inQuotes;
    if (!inQuotes) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) {
        parts.push(current);
        current = "";
        continue;
      }
    }
    current += ch;
  }
  parts.push(current);
  return parts.map((p) => p.trim());
}

// IFERROR's fallback argument can only trigger once the first argument has
// already errored, but hot-formula-parser evaluates all arguments eagerly
// before calling any function (built-in or custom), so an error in the
// first argument aborts the whole parse before IFERROR ever runs. Since our
// lessons always use IFERROR as the entire top-level formula, it's handled
// here by manually splitting and evaluating each branch instead.
function tryEvaluateIferror(trimmed: string, sheet: Sheet): EvalResult | null {
  const body = trimmed.slice(1).trim();
  const match = /^IFERROR\((.*)\)$/is.exec(body);
  if (!match) return null;
  const parts = splitTopLevelArgs(match[1]);
  if (parts.length !== 2) return null;
  const exprResult = evaluateFormula(`=${parts[0]}`, sheet);
  if (!exprResult.isError) return exprResult;
  return evaluateFormula(`=${parts[1]}`, sheet);
}

function formatResultValue(result: unknown): string {
  if (typeof result === "boolean") return result ? "TRUE" : "FALSE";
  if (typeof result === "number") return String(Math.round(result * 1e6) / 1e6);
  if (result instanceof Date) {
    const y = result.getFullYear();
    const m = result.getMonth() + 1;
    const d = result.getDate();
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  return String(result);
}

export function evaluateFormula(formula: string, sheet: Sheet): EvalResult {
  const trimmed = formula.trim();
  if (!trimmed) return { value: "", isError: false };
  if (!trimmed.startsWith("=")) {
    return { value: trimmed, isError: false };
  }

  const iferrorResult = tryEvaluateIferror(trimmed, sheet);
  if (iferrorResult) return iferrorResult;

  const parser = createParser(sheet);
  const { result, error } = parser.parse(trimmed.slice(1));

  if (error) {
    return { value: String(error), isError: true };
  }
  if (result === null || result === undefined) {
    return { value: "", isError: false };
  }
  return { value: formatResultValue(result), isError: false };
}

export const columnLetters = { colLetterToIndex, indexToColLetter };
