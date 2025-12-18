import { emphasize } from "../utils/text";
import { sanitize } from "../utils/text";
import { escapeHtml } from "../utils/escapeHtml";
import { extractResultsSnippet } from "../utils/resumeHelpers";

type BulletsProps = {
  highlights?: string[];
  preferResults?: boolean;
};

export function Bullets({ highlights = [], preferResults = true }: BulletsProps) {
  const items = highlights
    .map((highlight) => sanitize(highlight))
    .filter(Boolean)
    .map((highlight) => (preferResults ? extractResultsSnippet(highlight) : highlight))
    .filter(Boolean)
    .map((highlight) => emphasize(escapeHtml(highlight)));

  if (!items.length) return null;

  return (
    <ul className="bullets">
      {items.map((html, index) => (
        <li key={index} dangerouslySetInnerHTML={{ __html: html }} />
      ))}
    </ul>
  );
}
