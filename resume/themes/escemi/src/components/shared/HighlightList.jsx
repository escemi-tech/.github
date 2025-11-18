import React from "react";
import PropTypes from "prop-types";
import { emphasize } from "../../utils/resumeHelpers.js";

const HighlightList = ({
  items,
  tone = "light",
  dense = false,
  limit,
  className = "",
}) => {
  if (!items?.length) return null;
  const visibleItems =
    typeof limit === "number" && limit > 0 ? items.slice(0, limit) : items;
  if (!visibleItems.length) return null;
  const toneClass = tone === "dark" ? "text-slate-900" : "text-slate-600";
  const listClass = dense ? "mt-1.5 space-y-1.1" : "mt-2 space-y-1.5";
  const bulletClass = dense
    ? "text-[0.88rem] leading-snug"
    : "text-[0.95rem] leading-relaxed";
  const rootClass = [listClass, className].filter(Boolean).join(" ");
  return (
    <ul className={rootClass}>
      {visibleItems.map((line, idx) => (
        <li
          key={`highlight-${idx}`}
          className={`highlight-bullet ${bulletClass} ${toneClass}`}
          dangerouslySetInnerHTML={{ __html: emphasize(line) }}
        />
      ))}
    </ul>
  );
};

HighlightList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  tone: PropTypes.oneOf(["light", "dark"]),
  dense: PropTypes.bool,
  limit: PropTypes.number,
  className: PropTypes.string,
};

export default HighlightList;
