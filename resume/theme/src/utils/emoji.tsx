import type { ReactNode } from "react";

const TWEMOJI_BASE_URL =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg";

const EMOJI_TOKEN_REGEX =
  /(🧠|💼|🚀|🤝|🌍|🎓|🏅|📍|🔗|🎯|⚙️?|☁️?)/gu;

const toCodePoints = (value: string): number[] => {
  const points: number[] = [];
  for (const char of Array.from(value)) {
    points.push(char.codePointAt(0) ?? 0);
  }
  return points;
};

const toTwemojiAssetName = (emoji: string): string => {
  // Drop VS16 so the asset path matches Twemoji’s file naming.
  const codePoints = toCodePoints(emoji).filter((cp) => cp !== 0xfe0f && cp !== 0);
  return codePoints.map((cp) => cp.toString(16)).join("-");
};

const toTwemojiUrl = (emoji: string): string => {
  const asset = toTwemojiAssetName(emoji);
  return `${TWEMOJI_BASE_URL}/${asset}.svg`;
};

export const renderEmojiText = (value: string): ReactNode => {
  if (!value) return value;

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(EMOJI_TOKEN_REGEX)) {
    const index = match.index ?? 0;
    const token = match[0] ?? "";
    if (!token) continue;

    if (index > lastIndex) {
      parts.push(value.slice(lastIndex, index));
    }

    parts.push(
      <img
        key={`emoji-${index}`}
        className="emoji"
        src={toTwemojiUrl(token)}
        alt={token}
        aria-hidden="true"
        loading="eager"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );

    lastIndex = index + token.length;
  }

  if (!parts.length) return value;
  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts;
};
