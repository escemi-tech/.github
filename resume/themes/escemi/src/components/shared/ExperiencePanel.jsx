import React from "react";
import PropTypes from "prop-types";
import HighlightList from "./HighlightList.jsx";
import { formatDateRange, displayUrl } from "../../utils/resumeHelpers.js";
import { safeUrl } from "../../core.js";

const ExperiencePanel = ({
  item,
  locale,
  strings,
  variant = "showcase",
  dense = false,
  highlightLimit,
}) => {
  const heading = item.position || item.title || item.name || item.role;
  const company =
    item.name || item.organization || item.entity || item.client || null;
  const dates = formatDateRange(
    item.startDate,
    item.endDate,
    locale,
    strings.labels.present,
  );
  const isTimeline = variant === "timeline";
  const articleClass = [
    "experience-card",
    dense ? "experience-card--dense" : null,
    isTimeline ? "experience-card--timeline timeline-rail" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={articleClass}>
      {isTimeline && (
        <>
          <span className="timeline-dot" style={{ top: "1.35rem" }} />
          {item.keywords && item.keywords.length > 0 && (
            <span className="timeline-badge">{item.keywords[0]}</span>
          )}
        </>
      )}
      <header className="experience-card__header">
        <div className="experience-card__heading">
          {company && <p className="experience-card__company">{company}</p>}
          {heading && <h3 className="experience-card__title">{heading}</h3>}
        </div>
        {item.url && (
          <a
            href={safeUrl(item.url)}
            className="experience-card__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayUrl(item.url)}
          </a>
        )}
      </header>
      {(dates || item.location) && (
        <div className="experience-card__meta">
          {dates && <span className="experience-chip">{dates}</span>}
          {item.location && (
            <span className="experience-chip experience-chip--ghost">
              {item.location}
            </span>
          )}
        </div>
      )}
      {item.summary && (
        <p
          className={`experience-card__summary ${
            dense ? "experience-card__summary--compact" : ""
          }`}
        >
          {item.summary}
        </p>
      )}
      <div className="experience-card__highlights">
        <HighlightList
          items={item.highlights}
          tone={isTimeline ? "light" : "dark"}
          dense={dense || isTimeline}
          limit={highlightLimit}
          className={isTimeline ? "mt-1" : ""}
        />
      </div>
    </article>
  );
};

ExperiencePanel.propTypes = {
  item: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  strings: PropTypes.object.isRequired,
  variant: PropTypes.oneOf(["showcase", "timeline"]),
  dense: PropTypes.bool,
  highlightLimit: PropTypes.number,
};

export default ExperiencePanel;
