interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="함수 이름이나 키워드로 찾아보세요 (예: 합계, VLOOKUP)"
        className="w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus:border-emerald-400 focus:outline-none"
      />
    </div>
  );
}
