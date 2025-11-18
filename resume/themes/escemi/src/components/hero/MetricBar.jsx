import React from "react";
import PropTypes from "prop-types";

const MetricBar = ({ metrics }) => {
  if (!metrics?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {metrics.map((metric, index) => (
        <span key={`metric-${index}`} className="metric-chip">
          {metric}
        </span>
      ))}
    </div>
  );
};

MetricBar.propTypes = {
  metrics: PropTypes.arrayOf(PropTypes.string),
};

export default MetricBar;
