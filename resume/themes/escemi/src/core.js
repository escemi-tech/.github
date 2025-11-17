import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const FALLBACK_URL = "#";
const DEFAULT_ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

export const Section = forwardRef(
  ({ as: Component = "section", children, ...rest }, ref) => (
    <Component ref={ref} {...rest}>
      {children}
    </Component>
  ),
);
Section.displayName = "Section";

Section.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  children: PropTypes.node,
};

const hasProtocol = (value) => /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);

export function safeUrl(rawUrl, options = {}) {
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

export function getLinkRel(rawUrl, openInNewTab = false) {
  const rel = new Set();

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
