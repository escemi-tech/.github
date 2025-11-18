import React from "react";
import PropTypes from "prop-types";

const SectionHeading = ({ icon, label, tone = "bright" }) => {
  const color = tone === "bright" ? "text-[#1c3144]" : "text-slate-500";
  return (
    <div className={`section-title ${color}`}>
      <span aria-hidden>{icon}</span>
      {label}
    </div>
  );
};

SectionHeading.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(["bright", "muted"]),
};

export default SectionHeading;
