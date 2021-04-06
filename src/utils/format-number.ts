export function format(number: number, decimalDigit: number): string {
  const s = String(number)
      , i = s.indexOf(".");
  return s +  (decimalDigit === 0 ? "" : (i === -1 ? "." : "") + "0".repeat(decimalDigit - (i === -1 ? 0 : s.length - 1 - i)));
}
