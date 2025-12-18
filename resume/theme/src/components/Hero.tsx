import { renderEmojiText } from "../utils/emoji";

type ContactItem = {
  icon: string;
  label: string;
  href?: string;
};

type HeroProps = {
  imageSrc?: string;
  name: string;
  label: string;
  metrics?: string[];
  summary?: string;
  contactItems?: ContactItem[];
  profileItems?: ContactItem[];
};

function ContactInlineList({ items }: { items: ContactItem[] }) {
  if (!items.length) return null;
  return (
    <ul className="contact-inline-list" role="list">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="contact-inline-list__item">
          <span aria-hidden className="contact-inline-list__icon">
            {renderEmojiText(item.icon)}
          </span>
          {item.href ? (
            <a href={item.href} className="contact-inline-list__label">
              {item.label}
            </a>
          ) : (
            <span className="contact-inline-list__label">{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Hero({
  imageSrc,
  name,
  label,
  metrics = [],
  summary,
  contactItems = [],
  profileItems = [],
}: HeroProps) {
  return (
    <header className="hero glow-panel">
      <div className="hero-profile-row">
        {imageSrc ? (
          <div className="hero__avatar" aria-hidden="true">
            <img src={imageSrc} alt="" />
          </div>
        ) : null}

        <div className="hero__profile">
          {label ? <div className="hero__label">{label}</div> : null}
          <h1 className="hero__name">{name}</h1>
          {metrics.length ? (
            <div className="hero__metrics" aria-label="Key metrics">
              {metrics.map((metric, index) => (
                <span key={`metric-${index}`} className="metric-chip">
                  {metric}
                </span>
              ))}
            </div>
          ) : null}
          {summary ? (
            <div className="hero__summary">
              <p>{summary}</p>
            </div>
          ) : null}
        </div>
      </div>

      {contactItems.length || profileItems.length ? (
        <div className="hero-contact-row">
          <ContactInlineList items={contactItems} />
          <ContactInlineList items={profileItems} />
        </div>
      ) : null}
    </header>
  );
}
