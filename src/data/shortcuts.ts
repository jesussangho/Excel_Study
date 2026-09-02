export type ShortcutCategoryId =
  | "edit"
  | "navigate"
  | "select"
  | "format"
  | "formula"
  | "rowcol"
  | "file"
  | "data";

export interface ShortcutCategoryInfo {
  id: ShortcutCategoryId;
  name: string;
  emoji: string;
}

export const shortcutCategories: ShortcutCategoryInfo[] = [
  { id: "edit", name: "기본 편집", emoji: "✂️" },
  { id: "navigate", name: "이동", emoji: "🧭" },
  { id: "select", name: "선택", emoji: "🖱️" },
  { id: "format", name: "서식", emoji: "🎨" },
  { id: "formula", name: "수식·계산", emoji: "🧮" },
  { id: "rowcol", name: "행·열·시트", emoji: "📐" },
  { id: "file", name: "파일·화면", emoji: "🖥️" },
  { id: "data", name: "데이터", emoji: "📊" },
];

export interface Shortcut {
  id: string;
  keys: string[];
  description: string;
  category: ShortcutCategoryId;
  essential?: boolean;
}

export const shortcuts: Shortcut[] = [
  // ---- 기본 편집 ----
  { id: "copy", keys: ["Ctrl", "C"], description: "복사", category: "edit", essential: true },
  { id: "cut", keys: ["Ctrl", "X"], description: "잘라내기", category: "edit", essential: true },
  { id: "paste", keys: ["Ctrl", "V"], description: "붙여넣기", category: "edit", essential: true },
  { id: "paste-special", keys: ["Ctrl", "Alt", "V"], description: "선택하여 붙여넣기 (값만/서식만 등)", category: "edit" },
  { id: "undo", keys: ["Ctrl", "Z"], description: "실행 취소", category: "edit", essential: true },
  { id: "redo", keys: ["Ctrl", "Y"], description: "다시 실행", category: "edit" },
  { id: "fill-down", keys: ["Ctrl", "D"], description: "바로 위 셀 값/수식을 아래로 채우기", category: "edit", essential: true },
  { id: "fill-right", keys: ["Ctrl", "R"], description: "바로 왼쪽 셀 값/수식을 오른쪽으로 채우기", category: "edit" },
  { id: "clear-contents", keys: ["Delete"], description: "셀 내용 지우기 (서식은 유지)", category: "edit" },
  { id: "cancel-edit", keys: ["Esc"], description: "입력 중인 내용 취소", category: "edit" },
  { id: "insert-today", keys: ["Ctrl", ";"], description: "오늘 날짜 입력", category: "edit", essential: true },
  { id: "insert-now", keys: ["Ctrl", "Shift", ";"], description: "현재 시간 입력", category: "edit" },

  // ---- 이동 ----
  { id: "move-data-edge", keys: ["Ctrl", "방향키"], description: "데이터가 있는 영역의 끝으로 이동", category: "navigate", essential: true },
  { id: "move-a1", keys: ["Ctrl", "Home"], description: "맨 처음 셀(A1)로 이동", category: "navigate", essential: true },
  { id: "move-last-cell", keys: ["Ctrl", "End"], description: "데이터가 있는 마지막 셀로 이동", category: "navigate" },
  { id: "page-updown", keys: ["Page Up/Down"], description: "화면 단위로 위/아래 이동", category: "navigate" },
  { id: "page-leftright", keys: ["Alt", "Page Up/Down"], description: "화면 단위로 왼쪽/오른쪽 이동", category: "navigate" },
  { id: "find", keys: ["Ctrl", "F"], description: "찾기", category: "navigate", essential: true },
  { id: "replace", keys: ["Ctrl", "H"], description: "바꾸기", category: "navigate" },
  { id: "goto", keys: ["Ctrl", "G"], description: "이동 (셀 주소로 바로 이동, F5와 동일)", category: "navigate" },

  // ---- 선택 ----
  { id: "select-extend", keys: ["Shift", "방향키"], description: "선택 영역을 한 칸씩 확장", category: "select", essential: true },
  { id: "select-to-edge", keys: ["Ctrl", "Shift", "방향키"], description: "데이터 끝까지 한 번에 선택", category: "select", essential: true },
  { id: "select-all", keys: ["Ctrl", "A"], description: "전체 선택", category: "select" },
  { id: "select-column", keys: ["Ctrl", "Space"], description: "현재 열 전체 선택", category: "select" },
  { id: "select-row", keys: ["Shift", "Space"], description: "현재 행 전체 선택", category: "select" },
  { id: "select-to-last", keys: ["Ctrl", "Shift", "End"], description: "현재 위치부터 마지막 데이터까지 선택", category: "select" },
  { id: "select-to-first", keys: ["Ctrl", "Shift", "Home"], description: "현재 위치부터 A1까지 선택", category: "select" },

  // ---- 서식 ----
  { id: "bold", keys: ["Ctrl", "B"], description: "굵게", category: "format", essential: true },
  { id: "italic", keys: ["Ctrl", "I"], description: "기울임꼴", category: "format" },
  { id: "underline", keys: ["Ctrl", "U"], description: "밑줄", category: "format" },
  { id: "format-cells", keys: ["Ctrl", "1"], description: "셀 서식 창 열기", category: "format", essential: true },
  { id: "currency-format", keys: ["Ctrl", "Shift", "$"], description: "통화 서식 적용", category: "format" },
  { id: "percent-format", keys: ["Ctrl", "Shift", "%"], description: "백분율 서식 적용", category: "format" },
  { id: "comma-format", keys: ["Ctrl", "Shift", "1"], description: "천 단위 콤마 서식 적용", category: "format" },
  { id: "line-break", keys: ["Alt", "Enter"], description: "같은 셀 안에서 줄바꿈", category: "format", essential: true },
  { id: "add-border", keys: ["Ctrl", "Shift", "&"], description: "선택 영역에 테두리 적용", category: "format" },
  { id: "remove-border", keys: ["Ctrl", "Shift", "_"], description: "선택 영역 테두리 제거", category: "format" },

  // ---- 수식·계산 ----
  { id: "edit-cell", keys: ["F2"], description: "셀 편집 모드로 진입", category: "formula", essential: true },
  { id: "toggle-reference", keys: ["F4"], description: "참조를 상대/절대($고정)로 순서대로 전환", category: "formula", essential: true },
  { id: "recalculate", keys: ["F9"], description: "전체 통합 문서 다시 계산", category: "formula" },
  { id: "function-wizard", keys: ["Shift", "F3"], description: "함수 마법사(함수 삽입) 열기", category: "formula" },
  { id: "autosum", keys: ["Alt", "="], description: "자동 합계(SUM) 삽입", category: "formula", essential: true },
  { id: "show-formulas", keys: ["Ctrl", "`"], description: "수식/결과값 보기 전환", category: "formula" },
  { id: "next-argument", keys: ["Tab"], description: "수식 입력 중 다음 인수 자동완성 선택", category: "formula" },

  // ---- 행·열·시트 ----
  { id: "insert-cell", keys: ["Ctrl", "+"], description: "선택한 행/열/셀 삽입", category: "rowcol", essential: true },
  { id: "delete-cell", keys: ["Ctrl", "-"], description: "선택한 행/열/셀 삭제", category: "rowcol", essential: true },
  { id: "hide-row", keys: ["Ctrl", "9"], description: "선택한 행 숨기기", category: "rowcol" },
  { id: "hide-column", keys: ["Ctrl", "0"], description: "선택한 열 숨기기", category: "rowcol" },
  { id: "unhide-row", keys: ["Ctrl", "Shift", "9"], description: "숨긴 행 다시 표시", category: "rowcol" },
  { id: "unhide-column", keys: ["Ctrl", "Shift", "0"], description: "숨긴 열 다시 표시", category: "rowcol" },
  { id: "new-sheet", keys: ["Shift", "F11"], description: "새 시트 삽입", category: "rowcol" },
  { id: "next-sheet", keys: ["Ctrl", "Page Down"], description: "다음 시트로 이동", category: "rowcol", essential: true },
  { id: "prev-sheet", keys: ["Ctrl", "Page Up"], description: "이전 시트로 이동", category: "rowcol", essential: true },

  // ---- 파일·화면 ----
  { id: "new-workbook", keys: ["Ctrl", "N"], description: "새 통합 문서", category: "file" },
  { id: "save", keys: ["Ctrl", "S"], description: "저장", category: "file", essential: true },
  { id: "save-as", keys: ["F12"], description: "다른 이름으로 저장", category: "file" },
  { id: "print", keys: ["Ctrl", "P"], description: "인쇄", category: "file" },
  { id: "zoom", keys: ["Ctrl", "마우스 휠"], description: "화면 확대/축소", category: "file" },
  { id: "close-workbook", keys: ["Ctrl", "W"], description: "통합 문서 닫기", category: "file" },

  // ---- 데이터 ----
  { id: "make-table", keys: ["Ctrl", "T"], description: "선택 범위를 표(테이블)로 변환", category: "data", essential: true },
  { id: "toggle-filter", keys: ["Ctrl", "Shift", "L"], description: "자동 필터 켜기/끄기", category: "data", essential: true },
  { id: "open-filter-dropdown", keys: ["Alt", "↓"], description: "필터 드롭다운 목록 열기", category: "data" },
  { id: "group", keys: ["Alt", "Shift", "→"], description: "선택한 행/열 그룹화", category: "data" },
  { id: "ungroup", keys: ["Alt", "Shift", "←"], description: "그룹 해제", category: "data" },
];
