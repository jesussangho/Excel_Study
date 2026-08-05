import type { CategoryInfo } from "./types";

export const categories: CategoryInfo[] = [
  {
    id: "basic",
    name: "기초 연산",
    emoji: "➕",
    description: "숫자를 더하고 평균 내고 세어보는 가장 기본적인 함수예요.",
  },
  {
    id: "condition",
    name: "조건 처리",
    emoji: "🔎",
    description: "조건에 맞는 것만 골라서 계산하는 함수예요.",
  },
  {
    id: "text",
    name: "텍스트",
    emoji: "🔤",
    description: "글자를 자르고 합치고 길이를 재는 함수예요.",
  },
  {
    id: "lookup",
    name: "참조/조회",
    emoji: "🔗",
    description: "표에서 원하는 값을 찾아오는 함수예요.",
  },
  {
    id: "date",
    name: "날짜",
    emoji: "📅",
    description: "오늘 날짜, 연도, 월을 다루는 함수예요.",
  },
  {
    id: "logic",
    name: "논리",
    emoji: "🧠",
    description: "참/거짓을 판단하고 여러 조건을 합치는 함수예요.",
  },
  {
    id: "advanced",
    name: "실무 심화",
    emoji: "🚀",
    description: "실무에서 자주 쓰는 한 단계 더 어려운 함수예요.",
  },
];

export function getCategory(id: string): CategoryInfo | undefined {
  return categories.find((c) => c.id === id);
}
