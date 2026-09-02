# Excel Study (엑셀학습)

초등학생도 이해할 수 있는 눈높이로 엑셀 함수를 배우는 인터랙티브 학습 웹앱입니다. 각 함수마다 쉬운 설명, 실생활 비유, 직접 값을 바꿔볼 수 있는 미니 스프레드시트, 퀴즈를 제공합니다.

🔗 https://excel-study.vercel.app/

## 주요 기능

- **카테고리별 함수 학습**: 기초 연산, 조건 처리, 텍스트, 참조/조회, 날짜, 논리, 실무 심화 7개 카테고리
- **친절한 설명**: 함수마다 쉬운 풀이(`kidExplanation`)와 생활 속 비유(`analogy`) 제공
- **가이드 위젯**: 값을 바꿔가며 함수가 어떻게 동작하는지 바로 확인
- **미니 스프레드시트**: 실제 엑셀처럼 셀을 클릭하고 수식을 입력해보는 체험형 그리드 (`INDIRECT`처럼 다른 시트를 참조하는 함수도 지원)
- **퀴즈**: 함수마다 스토리형 문제 5개를 풀며 값이 아닌 실제 수식(예: `=SUM(A1:A3)`)을 직접 입력해서 익히는 방식. 입력한 수식을 수식 엔진으로 실제 계산해 채점해요.
- **검색**: 함수 이름이나 키워드로 빠르게 탐색

## 기술 스택

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (rolldown-vite) — 빌드/개발 서버
- [React Router](https://reactrouter.com/) — 라우팅
- [Tailwind CSS 4](https://tailwindcss.com/) — 스타일링
- [hot-formula-parser](https://github.com/handsontable/formula-parser) — 미니 스프레드시트 수식 계산
- [Oxlint](https://oxc.rs/) — 린팅

## 시작하기

```bash
npm install
npm run dev
```

개발 서버가 뜨면 브라우저에서 확인할 수 있습니다.

### 그 외 명령어

```bash
npm run build    # 타입 체크 + 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
npm run lint     # Oxlint 실행
```

## 프로젝트 구조

```
src/
├── components/   # UI 컴포넌트 (카드, 배지, 미니 스프레드시트, 가이드 위젯 등)
├── data/         # 함수/카테고리 데이터 및 타입 정의
├── lib/          # 수식 엔진, 한글 처리, 로컬 저장소 유틸
└── pages/        # 라우트별 페이지 (홈, 카테고리, 함수 상세)
```

## 함수 데이터 추가하기

새 함수는 [src/data/functions.ts](src/data/functions.ts)에 `ExcelFunction` 타입([src/data/types.ts](src/data/types.ts) 참고)에 맞춰 항목을 추가하면 됩니다. 카테고리를 새로 만들려면 [src/data/categories.ts](src/data/categories.ts)를 함께 수정하세요.

## 배포

`main` 브랜치에 push하면 [GitHub Actions](.github/workflows/main.yml)가 자동으로 빌드하여 GitHub Pages에 배포합니다.

## 라이선스

[LICENSE](LICENSE) 참고
