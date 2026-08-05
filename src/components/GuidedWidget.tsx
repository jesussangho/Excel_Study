import { useState } from "react";
import { evaluateFormula } from "../lib/formulaEngine";
import type { GuidedWidgetConfig } from "../data/types";

interface GuidedWidgetProps {
  config: GuidedWidgetConfig;
}

export function GuidedWidget({ config }: GuidedWidgetProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.cells.map((c) => [c.ref, c.defaultValue])),
  );

  const { value, isError } = evaluateFormula(config.formula, values);
  const editableCells = config.cells.filter((c) => c.editable);
  const fixedCells = config.cells.filter((c) => !c.editable);

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
      {fixedCells.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {fixedCells.map((cell) => (
            <div
              key={cell.ref}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
            >
              <span className="text-gray-400">{cell.label}: </span>
              <span className="font-mono font-medium text-gray-700">{cell.defaultValue}</span>
            </div>
          ))}
        </div>
      )}

      {editableCells.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {editableCells.map((cell) => (
            <label key={cell.ref} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500">{cell.label}</span>
              <input
                value={values[cell.ref] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [cell.ref]: e.target.value }))
                }
                className="w-28 rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm shadow-sm focus:border-emerald-400 focus:outline-none"
              />
            </label>
          ))}
        </div>
      )}

      <div className="mb-3 rounded-lg bg-gray-900 px-3 py-2 font-mono text-sm text-emerald-300">
        {config.formula}
      </div>

      <div
        className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
          isError
            ? "border-red-200 bg-red-50 text-red-600"
            : "border-emerald-300 bg-white text-emerald-700"
        }`}
      >
        <span className="text-sm font-medium">{config.resultLabel}</span>
        <span className="text-xl font-bold">{isError ? "오류" : value || "-"}</span>
      </div>
    </div>
  );
}
