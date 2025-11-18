import React from "react";
import PropTypes from "prop-types";

const ContactInlineList = ({ items, tone = "primary" }) => {
  if (!items?.length) return null;
  const toneClass =
    tone === "muted"
      ? "contact-inline-list__item--muted"
      : "contact-inline-list__item--primary";
  return (
    <div className="contact-inline-list">
      {items.map((item, index) => {
        const Tag = item.link ? "a" : "span";
        const tagProps = item.link
          ? {
              href: item.link,
              target: "_blank",
              rel: "noreferrer noopener",
            }
          : {};
        return (
          <Tag
            key={`contact-inline-${index}`}
            className={`contact-inline-list__item ${toneClass}`}
            {...tagProps}
          >
            <span className="contact-inline-list__icon" aria-hidden>
              {item.icon}
            </span>
            <span className="contact-inline-list__text">{item.label}</span>
          </Tag>
        );
      })}
    </div>
  );
};

ContactInlineList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
    }),
  ),
  tone: PropTypes.oneOf(["primary", "muted"]),
};

export default ContactInlineList;
