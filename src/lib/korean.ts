export function withRo(word: string): string {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return `${word}로`;
  const hasBatchim = (code - 0xac00) % 28 !== 0;
  return hasBatchim ? `${word}으로` : `${word}로`;
}
