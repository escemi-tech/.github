import React from "react";
import PropTypes from "prop-types";
import { safeUrl } from "../../core.js";
import HighlightList from "../shared/HighlightList.jsx";
import { displayUrl, formatDateRange } from "../../utils/resumeHelpers.js";

const CommunityCard = ({ item, locale, strings }) => {
  const dateRange = formatDateRange(
    item.startDate,
    item.endDate,
    locale,
    strings.labels.present,
  );
  const highlights = (item.highlights || []).slice(0, 2);
  return (
    <article className="community-card">
      <header className="community-card__header">
        <div>
          <p className="community-card__org">
            {item.organization || item.name}
          </p>
          {item.position && (
            <p className="community-card__role">{item.position}</p>
          )}
        </div>
        {dateRange && (
          <span className="community-card__badge">{dateRange}</span>
        )}
      </header>
      {item.summary && (
        <p className="community-card__summary">{item.summary}</p>
      )}
      <HighlightList items={highlights} tone="light" />
      {(item.location || item.url) && (
        <footer className="community-card__footer">
          {item.location && <span>{item.location}</span>}
          {item.url && (
            <a
              href={safeUrl(item.url)}
              target="_blank"
              rel="noreferrer noopener"
              className="community-card__link"
            >
              {displayUrl(item.url)}
            </a>
          )}
        </footer>
      )}
    </article>
  );
};

CommunityCard.propTypes = {
  item: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  strings: PropTypes.object.isRequired,
};

export default CommunityCard;
