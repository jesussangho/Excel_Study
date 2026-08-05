import type { Difficulty } from "../data/types";

const STYLES: Record<Difficulty, { label: string; className: string }> = {
  easy: { label: "쉬움", className: "bg-emerald-100 text-emerald-700" },
  medium: { label: "보통", className: "bg-amber-100 text-amber-700" },
  hard: { label: "어려움", className: "bg-rose-100 text-rose-700" },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { label, className } = STYLES[difficulty];
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
