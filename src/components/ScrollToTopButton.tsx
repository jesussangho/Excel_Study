import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 400;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="맨 위로 이동"
      className="fixed bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-500 shadow-lg transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-600"
    >
      ↑
    </button>
  );
}
