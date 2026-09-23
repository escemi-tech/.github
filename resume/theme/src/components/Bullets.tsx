import { renderEmphasizedText } from "../utils/text";
import { sanitize } from "../utils/text";
import { extractResultsSnippet } from "../utils/resumeHelpers";

type BulletsProps = {
  highlights?: string[];
  preferResults?: boolean;
};

export function Bullets({
  highlights = [],
  preferResults = true,
}: BulletsProps) {
  const items = highlights
    .map((highlight) => sanitize(highlight))
    .filter(Boolean)
    .map((highlight) =>
      preferResults ? extractResultsSnippet(highlight) : highlight,
    )
    .filter(Boolean)
    .map((highlight, index) => ({
      key: `${highlight}-${index}`,
      content: renderEmphasizedText(highlight),
    }));

  if (!items.length) return null;

  return (
    <ul className="bullets">
      {items.map((item) => (
        <li key={item.key}>
          <span>{item.content}</span>
        </li>
      ))}
    </ul>
  );
}
