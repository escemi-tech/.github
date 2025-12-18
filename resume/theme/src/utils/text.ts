export const truncateText = (value: string, maxChars: number): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
};

export const joinDefined = (...tokens: Array<string | null | undefined>) =>
  tokens
    .map((token) => (token ? token.trim() : ""))
    .filter(Boolean)
    .join(" ");
export const sanitize = (value?: string | null): string => value?.trim() || "";
export const emphasize = (text?: string | null): string => {
  if (!text) return "";
  let value = text;
  const thousandsSeparator = String.raw`[ \u00A0\u202F\u2009]`;
  const numberPattern = String.raw`(?:\d{1,3}(?:[.,]${thousandsSeparator}?\d{3}|${thousandsSeparator}\d{3})+|\d+)(?:[.,]\d+)?`;
  const numberRangePattern = String.raw`${numberPattern}(?:[KMB])?(?:\s*[-–]\s*${numberPattern}(?:[KMB])?)?`;
  const comparatorPattern = String.raw`(?:~|(?:&lt;|&gt;|[<>≤≥])=?)`;
  const currencySegments: Array<{ token: string; content: string }> = [];
  const toCurrencyPlaceholder = (content: string) => {
    const token = `@@CURRENCY_HL_${currencySegments.length}@@`;
    currencySegments.push({ token, content });
    return token;
  };
  value = value.replace(
    new RegExp(`([€$£])(\\s*)(${numberRangePattern})`, "gi"),
    (match, symbol, spacing, amount) =>
      toCurrencyPlaceholder(`<strong>${symbol}${spacing}${amount}</strong>`),
  );
  value = value.replace(
    new RegExp(`(${numberRangePattern})(\\s*)([€$£])`, "gi"),
    (match, amount, spacing, symbol) =>
      toCurrencyPlaceholder(`<strong>${amount}${spacing}${symbol}</strong>`),
  );
  value = value.replace(
    /(\d+(?:-\d+)?\s+[a-z]+\s+to\s+\d+(?:-\d+)?\s+[a-z]+)/gi,
    "<em>$1</em>",
  );
  value = value.replace(
    /(\d+(?:\.\d+)?\s*[a-z]+\s*→\s*\d+(?:\.\d+)?\s*[a-z]+)/gi,
    "<em>$1</em>",
  );
  value = value.replace(
    new RegExp(
      `(${comparatorPattern}\\s*${numberPattern}\\s*[a-zA-Zµμ]+)`,
      "g",
    ),
    "<em>$1</em>",
  );
  value = value.replace(
    new RegExp(`(${numberPattern})(\\s*)([★⭐]+)`, "g"),
    "<em>$1$2$3</em>",
  );
  value = value.replace(
    new RegExp(`([+\\-~]?${numberPattern}\\s*%)`, "g"),
    "<em>$1</em>",
  );
  value = value.replace(
    new RegExp(`(${numberPattern}[KMB])(?![a-zA-Zµμ])`, "gi"),
    "<strong>$1</strong>",
  );
  value = value.replace(
    new RegExp(`(${numberPattern}\\+)`, "g"),
    "<strong>$1</strong>",
  );
  currencySegments.forEach(({ token, content }) => {
    value = value.replace(token, content);
  });
  return value;
};
export const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
