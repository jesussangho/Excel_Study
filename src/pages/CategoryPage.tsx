import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getCategory } from "../data/categories";
import { getFunctionsByCategory } from "../data/functions";
import { FunctionCard } from "../components/FunctionCard";
import { getCompletedIds, getFavoriteIds } from "../lib/storage";

export function CategoryPage() {
  const { categoryId = "" } = useParams();
  const category = getCategory(categoryId);
  const completed = useMemo(() => getCompletedIds(), []);
  const favorites = useMemo(() => getFavoriteIds(), []);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const functions = getFunctionsByCategory(category.id);

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="text-sm font-medium text-gray-400 hover:text-gray-600">
        ← 홈으로
      </Link>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">
          {category.emoji} {category.name}
        </h1>
        <p className="mt-1 text-gray-500">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {functions.map((fn) => (
          <FunctionCard
            key={fn.id}
            fn={fn}
            isCompleted={completed.has(fn.id)}
            isFavorite={favorites.has(fn.id)}
          />
        ))}
      </div>
    </div>
  );
}
