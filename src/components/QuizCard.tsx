import { useState } from "react";
import type { QuizQuestion } from "../data/types";
import { evaluateFormula } from "../lib/formulaEngine";
import { addWrongAnswer, markCompleted, removeWrongAnswer } from "../lib/storage";

interface QuizCardProps {
  functionId: string;
  functionName: string;
  quizzes: QuizQuestion[];
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s/g, "");
}

// "INDEX + MATCH" needs both INDEX( and MATCH( present; a plain "SUM" only
// needs "SUM(" — the trailing paren keeps SUMIF from matching a SUM answer.
function usesFunction(formula: string, functionName: string): boolean {
  const upper = formula.toUpperCase();
  return functionName
    .split("+")
    .map((part) => `${part.trim().toUpperCase()}(`)
    .every((needle) => upper.includes(needle));
}

export function QuizCard({ functionId, functionName, quizzes }: QuizCardProps) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong" | "missing-function">("idle");
  const [hadWrong, setHadWrong] = useState(false);
  const [finished, setFinished] = useState(false);

  const quiz = quizzes[index];
  const total = quizzes.length;

  function submit() {
    if (!input.trim()) return;
    const formula = input.trim().startsWith("=") ? input.trim() : `=${input.trim()}`;

    if (!usesFunction(formula, functionName)) {
      setStatus("missing-function");
      setHadWrong(true);
      return;
    }

    const userResult = evaluateFormula(formula, quiz.sheet, quiz.sheetMap);
    const expected = evaluateFormula(quiz.answer, quiz.sheet, quiz.sheetMap);
    const isCorrect = !userResult.isError && normalize(userResult.value) === normalize(expected.value);

    setStatus(isCorrect ? "correct" : "wrong");
    if (!isCorrect) setHadWrong(true);
  }

  function next() {
    if (index + 1 >= total) {
      setFinished(true);
      markCompleted(functionId);
      if (hadWrong) {
        addWrongAnswer(functionId);
      } else {
        removeWrongAnswer(functionId);
      }
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setStatus("idle");
  }

  function retry() {
    setStatus("idle");
    setInput("");
  }

  function restart() {
    setIndex(0);
    setInput("");
    setStatus("idle");
    setHadWrong(false);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 text-center">
        <p className="mb-1 text-3xl">🎉</p>
        <p className="mb-3 font-semibold text-emerald-700">
          {total}문제를 모두 풀었어요! {functionName} 함수를 직접 써보며 익혔어요.
        </p>
        <button
          type="button"
          onClick={restart}
          className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-indigo-500">직접 수식 써보기</p>
        <p className="text-xs font-medium text-indigo-400">
          {index + 1} / {total}
        </p>
      </div>
      <p className="mb-4 text-base font-medium text-gray-800">{quiz.story}</p>

      <div className="flex flex-wrap gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={status === "correct"}
          placeholder={`${functionName} 수식을 직접 입력해보세요 (예: =${functionName.split("+")[0].trim()}(...))`}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm shadow-sm focus:border-indigo-400 focus:outline-none disabled:bg-gray-100"
        />
        {status === "correct" ? (
          <button
            type="button"
            onClick={next}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            {index + 1 >= total ? "완료" : "다음 문제"}
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
          아직 정답이 아니에요. {functionName} 함수로 수식을 다시 적어보세요.{" "}
          <button
            type="button"
            onClick={retry}
            className="ml-2 font-semibold underline underline-offset-2"
          >
            다시 풀기
          </button>
        </div>
      )}

      {status === "missing-function" && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          {functionName} 함수를 사용한 수식(=으로 시작)을 입력해야 해요.{" "}
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
