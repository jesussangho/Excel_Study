import { Link } from "react-router-dom";
import type { CategoryInfo } from "../data/types";

export function CategoryCard({ category, count }: { category: CategoryInfo; count: number }) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      <span className="text-3xl">{category.emoji}</span>
      <span className="text-lg font-bold text-gray-800">{category.name}</span>
      <span className="text-sm text-gray-500">{category.description}</span>
      <span className="mt-1 text-xs font-semibold text-emerald-600">함수 {count}개</span>
    </Link>
  );
}
