import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import { excelFunctions, getFunctionsByCategory, searchFunctions } from "../data/functions";
import { CategoryCard } from "../components/CategoryCard";
import { FunctionCard } from "../components/FunctionCard";
import { SearchBox } from "../components/SearchBox";
import { getCompletedIds, getFavoriteIds, getWrongIds } from "../lib/storage";

export function HomePage() {
  const [query, setQuery] = useState("");
  const completed = useMemo(() => getCompletedIds(), []);
  const favorites = useMemo(() => getFavoriteIds(), []);
  const wrong = useMemo(() => getWrongIds(), []);

  const searchResults = query.trim() ? searchFunctions(query) : [];
  const favoriteFns = excelFunctions.filter((f) => favorites.has(f.id));
  const wrongFns = excelFunctions.filter((f) => wrong.has(f.id));

  return (
    <div className="flex flex-col gap-10">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
          엑셀 함수, 놀면서 배워요!
        </h1>
        <p className="mt-3 text-gray-500">
          쉬운 설명과 직접 눌러보는 예제로 엑셀 함수를 익혀보세요.
        </p>
        <p className="mt-1 text-sm font-medium text-emerald-600">
          지금까지 {completed.size} / {excelFunctions.length}개 함수를 배웠어요.
        </p>
        <div className="mt-6">
          <SearchBox value={query} onChange={setQuery} />
        </div>
      </section>

      {query.trim() && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-700">검색 결과</h2>
          {searchResults.length === 0 ? (
            <p className="text-sm text-gray-400">일치하는 함수를 찾지 못했어요.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {searchResults.map((fn) => (
                <FunctionCard
                  key={fn.id}
                  fn={fn}
                  isCompleted={completed.has(fn.id)}
                  isFavorite={favorites.has(fn.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-700">카테고리별로 둘러보기</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} count={getFunctionsByCategory(cat.id).length} />
          ))}
        </div>
      </section>

      <Link
        to="/shortcuts"
        className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
      >
        <span className="flex items-center gap-3">
          <span className="text-3xl">⌨️</span>
          <span>
            <span className="block text-lg font-bold text-gray-800">엑셀 단축키 모음</span>
            <span className="block text-sm text-gray-500">
              기본 단축키부터 실무 필수 단축키까지 익혀보세요
            </span>
          </span>
        </span>
        <span className="text-gray-300">→</span>
      </Link>

      {favoriteFns.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-700">⭐ 즐겨찾기</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {favoriteFns.map((fn) => (
              <FunctionCard
                key={fn.id}
                fn={fn}
                isCompleted={completed.has(fn.id)}
                isFavorite
              />
            ))}
          </div>
        </section>
      )}

      {wrongFns.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-700">📝 틀린 문제 다시 보기</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {wrongFns.map((fn) => (
              <Link
                key={fn.id}
                to={`/function/${fn.id}`}
                className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 hover:bg-rose-100"
              >
                {fn.name} 다시 풀어보기
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
