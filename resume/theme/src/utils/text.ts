import { createElement, type ReactNode } from "react";
import { escapeHtml } from "./escapeHtml";

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
const ENTITY_LOOKUP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
};

type InlineNode = string | { tag: "em" | "strong"; children: InlineNode[] };

const decodeHtmlEntities = (value: string): string =>
  value.replace(
    /&(amp|lt|gt|quot|#39);/g,
    (_, entity) => ENTITY_LOOKUP[entity] || `&${entity};`,
  );

const parseInlineMarkup = (value: string): InlineNode[] => {
  const root: { children: InlineNode[] } = { children: [] };
  const stack: Array<{ tag?: "em" | "strong"; children: InlineNode[] }> = [
    root,
  ];
  const tagPattern = /<\/?(strong|em)>/g;
  let lastIndex = 0;

  for (const match of value.matchAll(tagPattern)) {
    const fullMatch = match[0];
    const tag = match[1] as "em" | "strong";
    const index = match.index ?? 0;

    if (index > lastIndex) {
      stack[stack.length - 1]?.children.push(
        decodeHtmlEntities(value.slice(lastIndex, index)),
      );
    }

    if (fullMatch.startsWith("</")) {
      if (stack[stack.length - 1]?.tag === tag) {
        stack.pop();
      }
    } else {
      const node = { tag, children: [] as InlineNode[] };
      stack[stack.length - 1]?.children.push(node);
      stack.push(node);
    }

    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < value.length) {
    stack[stack.length - 1]?.children.push(
      decodeHtmlEntities(value.slice(lastIndex)),
    );
  }

  return root.children;
};

const renderInlineNodes = (
  nodes: InlineNode[],
  keyPrefix = "inline",
): ReactNode[] =>
  nodes.map((node, index) => {
    if (typeof node === "string") {
      return node;
    }

    return createElement(
      node.tag,
      { key: `${keyPrefix}-${index}` },
      renderInlineNodes(node.children, `${keyPrefix}-${index}`),
    );
  });

export const emphasize = (text?: string | null): string => {
  if (!text) return "";
  let value = text;
  const thousandsSeparator = String.raw`[ \u00A0\u202F\u2009]`;
  const numberPattern = String.raw`(?:\d{1,3}(?:[.,]${thousandsSeparator}?\d{3}|${thousandsSeparator}\d{3})+|\d+)(?:[.,]\d+)?`;
  const numberRangePattern = String.raw`${numberPattern}(?:[KMB])?(?:\s*[-–]\s*${numberPattern}(?:[KMB])?)?`;
  const comparatorPattern = "(?:~|(?:&lt;|&gt;|[<>≤≥])=?)";
  const currencySegments: Array<{ token: string; content: string }> = [];
  const toCurrencyPlaceholder = (content: string) => {
    const token = `@@CURRENCY_HL_${currencySegments.length}@@`;
    currencySegments.push({ token, content });
    return token;
  };
  value = value.replace(
    new RegExp(`([€$£])(\\s*)(${numberRangePattern})`, "gi"),
    (_match, symbol, spacing, amount) =>
      toCurrencyPlaceholder(`<strong>${symbol}${spacing}${amount}</strong>`),
  );
  value = value.replace(
    new RegExp(`(${numberRangePattern})(\\s*)([€$£])`, "gi"),
    (_match, amount, spacing, symbol) =>
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
export const renderEmphasizedText = (text?: string | null): ReactNode[] =>
  renderInlineNodes(parseInlineMarkup(emphasize(escapeHtml(text))));

export const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
