import type { ReactNode } from "react";
import { renderEmojiText } from "../utils/emoji";

type SectionProps = {
  title: string;
  children: ReactNode;
  forceBreakBefore?: boolean;
  className?: string;
};

export function Section({ title, children, forceBreakBefore, className }: SectionProps) {
  const resolvedClassName = [
    "section",
    forceBreakBefore ? "section--break" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={resolvedClassName}>
      <h2 className="section__title">{renderEmojiText(title)}</h2>
      {children}
    </section>
  );
}
