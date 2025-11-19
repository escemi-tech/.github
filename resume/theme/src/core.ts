const FALLBACK_URL = "#";
const DEFAULT_ALLOWED_PROTOCOLS = [
  "http:",
  "https:",
  "mailto:",
  "tel:",
] as const;

const hasProtocol = (value: string) => /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);

type SafeUrlOptions = {
  allowedProtocols?: readonly string[];
};

export function safeUrl(
  rawUrl: string | undefined | null,
  options: SafeUrlOptions = {},
): string {
  if (typeof rawUrl !== "string" || rawUrl.trim() === "") {
    return FALLBACK_URL;
  }

  const allowedProtocols =
    options.allowedProtocols || DEFAULT_ALLOWED_PROTOCOLS;
  const normalizedProtocols = new Set(allowedProtocols);
  const trimmed = rawUrl.trim();

  try {
    if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
      const protocol = `${trimmed.split(":", 1)[0]}:`;
      return normalizedProtocols.has(protocol) ? trimmed : FALLBACK_URL;
    }

    const candidate = hasProtocol(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(candidate);

    return normalizedProtocols.has(url.protocol) ? url.href : FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

export function getLinkRel(
  rawUrl?: string,
  openInNewTab = false,
): string | undefined {
  const rel = new Set<string>();

  if (openInNewTab) {
    rel.add("noopener");
    rel.add("noreferrer");
  }

  if (rawUrl) {
    const isLikelyExternal = (() => {
      try {
        const url = new URL(rawUrl, "http://localhost");
        return url.origin !== "null" && url.hostname !== "localhost";
      } catch {
        return true;
      }
    })();

    if (isLikelyExternal) {
      rel.add("nofollow");
      rel.add("external");
    }
  }

  const relValue = Array.from(rel).join(" ");
  return relValue || undefined;
}
