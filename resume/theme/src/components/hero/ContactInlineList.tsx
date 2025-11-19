type ContactItem = {
  icon: string;
  label: string;
  link?: string;
};

type ContactInlineListProps = {
  items?: ContactItem[];
  tone?: "primary" | "muted";
};

const ContactInlineList = ({ items, tone = "primary" }: ContactInlineListProps) => {
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

export type { ContactItem };
export default ContactInlineList;
