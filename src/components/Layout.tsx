import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-gray-800">
            <span className="text-2xl">📊</span>
            엑셀 함수 놀이터
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link
              to="/shortcuts"
              className="text-sm font-medium text-gray-400 hover:text-gray-600"
            >
              ⌨️ 단축키
            </Link>
            <Link
              to="/requests"
              className="text-sm font-medium text-gray-400 hover:text-gray-600"
            >
              💭 건의함
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-4xl px-4 py-8 text-center text-xs text-gray-400">
        놀면서 배우는 엑셀 함수 학습 사이트
      </footer>
    </div>
  );
}
