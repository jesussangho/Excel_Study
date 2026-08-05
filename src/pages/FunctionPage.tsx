import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getFunctionById } from "../data/functions";
import { getCategory } from "../data/categories";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { GuidedWidget } from "../components/GuidedWidget";
import { MiniSpreadsheet } from "../components/MiniSpreadsheet";
import { QuizCard } from "../components/QuizCard";
import { isFavorite, toggleFavorite } from "../lib/storage";
import { withRo } from "../lib/korean";

export function FunctionPage() {
  const { functionId = "" } = useParams();
  const fn = getFunctionById(functionId);
  const [favorite, setFavorite] = useState(() => isFavorite(functionId));

  if (!fn) {
    return <Navigate to="/" replace />;
  }

  const category = getCategory(fn.category);

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={category ? `/category/${category.id}` : "/"}
        className="text-sm font-medium text-gray-400 hover:text-gray-600"
      >
        ← {withRo(category ? category.name : "홈")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-3xl font-extrabold text-gray-800">{fn.name}</h1>
            <DifficultyBadge difficulty={fn.difficulty} />
          </div>
          <p className="mt-2 inline-block rounded-lg bg-gray-900 px-3 py-1.5 font-mono text-sm text-emerald-300">
            {fn.syntax}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFavorite(toggleFavorite(fn.id))}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            favorite
              ? "border-amber-300 bg-amber-50 text-amber-600"
              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          {favorite ? "⭐ 즐겨찾기 됨" : "☆ 즐겨찾기"}
        </button>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-base leading-relaxed text-gray-700">{fn.kidExplanation}</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">💡 {fn.analogy}</p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-700">1. 숫자를 바꿔보며 이해하기</h2>
        <GuidedWidget config={fn.guided} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-700">2. 직접 셀에 입력해보기</h2>
        <MiniSpreadsheet preset={fn.spreadsheet} />
      </section>

      <section className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-700">
        🛠 실무 팁: {fn.tip}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-700">3. 문제로 확인하기</h2>
        <QuizCard functionId={fn.id} quiz={fn.quiz} />
      </section>
    </div>
  );
}
