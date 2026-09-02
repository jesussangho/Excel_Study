import { useMemo, useState } from "react";
import { shortcutCategories, shortcuts, type ShortcutCategoryId } from "../data/shortcuts";
import { SearchBox } from "../components/SearchBox";
import { getMemorizedShortcutIds, toggleMemorizedShortcut } from "../lib/storage";

function KeyCombo({ keys }: { keys: string[] }) {
  return (
    <span className="flex flex-wrap items-center gap-1">
      {keys.map((key, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-xs text-gray-400">+</span>}
          <kbd className="rounded-md border border-gray-300 bg-gray-50 px-2 py-1 font-mono text-xs font-semibold text-gray-700 shadow-sm">
            {key}
          </kbd>
        </span>
      ))}
    </span>
  );
}

export function ShortcutsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ShortcutCategoryId | "all">("all");
  const [memorized, setMemorized] = useState(() => getMemorizedShortcutIds());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shortcuts.filter((s) => {
      if (activeCategory !== "all" && s.category !== activeCategory) return false;
      if (!q) return true;
      return (
        s.description.toLowerCase().includes(q) ||
        s.keys.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [query, activeCategory]);

  function toggle(id: string) {
    toggleMemorizedShortcut(id);
    setMemorized(getMemorizedShortcutIds());
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">⌨️ 엑셀 단축키 모음</h1>
        <p className="mt-3 text-gray-500">기본 단축키부터 실무에서 자주 쓰는 것까지 모아봤어요.</p>
        <p className="mt-1 text-sm font-medium text-emerald-600">
          지금까지 {memorized.size} / {shortcuts.length}개 외웠어요.
        </p>
        <div className="mt-6">
          <SearchBox
            value={query}
            onChange={setQuery}
            placeholder="단축키나 설명으로 찾아보세요 (예: 복사, Ctrl+C)"
          />
        </div>
      </section>

      <section className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
            activeCategory === "all"
              ? "bg-emerald-500 text-white"
              : "bg-white text-gray-500 hover:bg-gray-100"
          } border border-gray-200`}
        >
          전체
        </button>
        {shortcutCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
              activeCategory === cat.id
                ? "bg-emerald-500 text-white"
                : "bg-white text-gray-500 hover:bg-gray-100"
            } border border-gray-200`}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400">일치하는 단축키를 찾지 못했어요.</p>
        ) : (
          filtered.map((s) => {
            const isMemorized = memorized.has(s.id);
            return (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-1 flex-wrap items-center gap-4">
                  <div className="w-40 shrink-0">
                    <KeyCombo keys={s.keys} />
                  </div>
                  <p className="text-sm text-gray-700">
                    {s.description}
                    {s.essential && (
                      <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        ⭐ 많이 써요
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    isMemorized
                      ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                      : "border-gray-300 bg-white text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {isMemorized ? "✅ 외웠어요" : "외우기"}
                </button>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
