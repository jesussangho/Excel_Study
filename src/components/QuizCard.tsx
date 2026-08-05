import { useState } from "react";
import type { QuizQuestion } from "../data/types";
import { addWrongAnswer, markCompleted, removeWrongAnswer } from "../lib/storage";

interface QuizCardProps {
  functionId: string;
  quiz: QuizQuestion;
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/[\s,]/g, "");
}

export function QuizCard({ functionId, quiz }: QuizCardProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  function submit() {
    if (!input.trim()) return;
    const isCorrect = normalize(input) === normalize(quiz.answer);
    if (isCorrect) {
      setStatus("correct");
      markCompleted(functionId);
      removeWrongAnswer(functionId);
    } else {
      setStatus("wrong");
      addWrongAnswer(functionId);
    }
  }

  function retry() {
    setStatus("idle");
    setInput("");
  }

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
      <p className="mb-1 text-xs font-semibold text-indigo-500">직접 풀어보기</p>
      <p className="mb-4 text-base font-medium text-gray-800">{quiz.story}</p>

      <div className="flex flex-wrap gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={status === "correct"}
          placeholder="정답을 입력해보세요"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none disabled:bg-gray-100"
        />
        {status === "correct" ? (
          <button
            type="button"
            disabled
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
          >
            정답!
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
          >
            확인
          </button>
        )}
      </div>

      {status === "wrong" && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          아직 정답이 아니에요. 힌트: <span className="font-mono">{quiz.formulaHint}</span>{" "}
          <button
            type="button"
            onClick={retry}
            className="ml-2 font-semibold underline underline-offset-2"
          >
            다시 풀기
          </button>
        </div>
      )}

      {status === "correct" && (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {quiz.explanation}
        </div>
      )}
    </div>
  );
}
