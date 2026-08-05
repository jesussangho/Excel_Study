import { Link } from "react-router-dom";
import type { ExcelFunction } from "../data/types";
import { DifficultyBadge } from "./DifficultyBadge";

interface FunctionCardProps {
  fn: ExcelFunction;
  isCompleted: boolean;
  isFavorite: boolean;
}

export function FunctionCard({ fn, isCompleted, isFavorite }: FunctionCardProps) {
  return (
    <Link
      to={`/function/${fn.id}`}
      className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg font-bold text-gray-800">{fn.name}</span>
        <div className="flex items-center gap-1.5">
          {isFavorite && <span title="즐겨찾기">⭐</span>}
          {isCompleted && <span title="학습 완료">✅</span>}
          <DifficultyBadge difficulty={fn.difficulty} />
        </div>
      </div>
      <p className="text-sm text-gray-500">{fn.kidExplanation}</p>
    </Link>
  );
}
