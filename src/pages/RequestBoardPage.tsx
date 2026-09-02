import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface RequestRow {
  id: string;
  message: string;
  created_at: string;
}

const MAX_LENGTH = 300;

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR");
}

export function RequestBoardPage() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    client
      .from("requests")
      .select("id, message, created_at")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError("목록을 불러오지 못했어요.");
        else setRequests(data ?? []);
        setLoading(false);
      });

    const channel = client
      .channel("requests-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "requests" },
        (payload) => {
          setRequests((prev) => [payload.new as RequestRow, ...prev]);
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "requests" },
        (payload) => {
          const deletedId = (payload.old as Partial<RequestRow>).id;
          setRequests((prev) => prev.filter((r) => r.id !== deletedId));
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  async function submit() {
    const message = input.trim();
    if (!message || !supabase) return;
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase.from("requests").insert({ message });
    setSubmitting(false);
    if (insertError) {
      setError("등록에 실패했어요. 잠시 후 다시 시도해주세요.");
      return;
    }
    setInput("");
  }

  async function remove(id: string) {
    if (!supabase) return;
    if (!window.confirm("이 요청을 삭제할까요?")) return;
    setDeletingId(id);
    const { error: deleteError } = await supabase.from("requests").delete().eq("id", id);
    setDeletingId(null);
    if (deleteError) {
      setError("삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
      return;
    }
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  if (!supabase) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-700">
        요청 게시판을 사용하려면 <code className="font-mono">VITE_SUPABASE_URL</code>과{" "}
        <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> 환경변수 설정이 필요해요.
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-extrabold text-gray-800">💭 건의함</h1>
        <p className="mt-2 text-sm text-gray-500">
          배우고 싶은 함수, 있으면 좋겠는 버튼이나 기능 등 뭐든 자유롭게 남겨보세요. 남긴 글은
          누구나 볼 수 있어요.
        </p>
      </section>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="예: PROPER 함수도 있으면 좋겠어요! / 다크모드 버튼 있으면 좋겠어요!"
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {input.length} / {MAX_LENGTH}
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={!input.trim() || submitting}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? "등록 중..." : "요청하기"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </section>

      <section className="flex flex-col gap-2">
        {loading ? (
          <p className="text-sm text-gray-400">불러오는 중...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-gray-400">아직 등록된 요청이 없어요. 첫 요청을 남겨보세요!</p>
        ) : (
          requests.map((r) => (
            <div
              key={r.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4"
            >
              <div>
                <p className="text-sm text-gray-700">{r.message}</p>
                <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(r.created_at)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(r.id)}
                disabled={deletingId === r.id}
                className="shrink-0 text-xs text-gray-300 hover:text-rose-500 disabled:opacity-50"
                aria-label="삭제"
              >
                🗑
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
