import { useState } from "react";
import { evaluateFormula } from "../lib/formulaEngine";
import type { SpreadsheetPreset } from "../data/types";

interface MiniSpreadsheetProps {
  preset: SpreadsheetPreset;
}

export function MiniSpreadsheet({ preset }: MiniSpreadsheetProps) {
  const [cells, setCells] = useState<Record<string, string>>(preset.cells);
  const [activeRef, setActiveRef] = useState<string | null>(null);

  const rowNumbers = Array.from({ length: preset.rows }, (_, i) => i + 1);

  function reset() {
    setCells(preset.cells);
    setActiveRef(null);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm text-gray-500">{preset.hint}</p>
        <button
          type="button"
          onClick={reset}
          className="shrink-0 rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          초기화
        </button>
      </div>

      <div className="mb-2 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
        <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-700">
          {activeRef ?? "-"}
        </span>
        <span className="font-mono text-gray-700">
          {activeRef ? cells[activeRef] || "" : "셀을 클릭해보세요"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-8 border border-gray-200 bg-gray-50" />
              {preset.cols.map((col) => (
                <th
                  key={col}
                  className="border border-gray-200 bg-gray-50 px-2 py-1 font-semibold text-gray-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowNumbers.map((row) => (
              <tr key={row}>
                <td className="border border-gray-200 bg-gray-50 px-2 text-center text-xs font-semibold text-gray-400">
                  {row}
                </td>
                {preset.cols.map((col) => {
                  const ref = `${col}${row}`;
                  const raw = cells[ref] ?? "";
                  const isEditing = activeRef === ref;
                  const { value, isError } = evaluateFormula(raw, cells);
                  return (
                    <td key={ref} className="border border-gray-200 p-0">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={raw}
                          onChange={(e) =>
                            setCells((prev) => ({ ...prev, [ref]: e.target.value }))
                          }
                          onBlur={() => setActiveRef(null)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === "Escape") {
                              e.currentTarget.blur();
                            }
                          }}
                          className="w-20 min-w-full px-2 py-1.5 font-mono text-sm outline-2 outline-emerald-400"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveRef(ref)}
                          className={`w-20 min-w-full px-2 py-1.5 text-right font-mono hover:bg-emerald-50 ${
                            isError ? "text-red-500" : "text-gray-800"
                          }`}
                        >
                          {value}
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
