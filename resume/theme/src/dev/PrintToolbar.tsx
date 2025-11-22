import { useEffect, useMemo, useState, type RefObject } from "react";
import { useReactToPrint } from "react-to-print";

const PAGE_STYLE = `
  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    body {
      margin: 0;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

const resolveLabels = (locale = "en") => {
  const lang = locale.split("-")[0]?.toLowerCase();
  if (lang === "fr") {
    return {
      title: "Imprimer le CV",
      action: "Imprimer le CV",
      language: "Langue",
      languages: {
        en: "Anglais",
        fr: "Français",
      },
    } as const;
  }
  return {
    title: "Print resume",
    action: "Print resume",
    language: "Language",
    languages: {
      en: "English",
      fr: "French",
    },
  } as const;
};

type PrintToolbarProps = {
  targetRef: RefObject<HTMLElement>;
  locale?: string;
  onLocaleChange?: (value: string) => void;
};
const LOCALE_OPTIONS = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const PrintToolbar = ({ targetRef, locale = "en", onLocaleChange }: PrintToolbarProps) => {
  const [targetNode, setTargetNode] = useState<HTMLElement | null>(null);
  const labels = useMemo(() => resolveLabels(locale), [locale]);

  useEffect(() => {
    setTargetNode(targetRef.current);
  }, [targetRef]);

  const handlePrint = useReactToPrint({
    contentRef: targetRef,
    pageStyle: PAGE_STYLE,
    documentTitle: document.title || labels.title,
  });

  return (
    <div className="print-toolbar" role="region" aria-live="polite">
      {onLocaleChange ? (
        <div className="print-toolbar__language" role="group" aria-label={labels.language}>
          {LOCALE_OPTIONS.map(({ code, label }) => {
            const isActive = code === locale;
            return (
              <button
                key={code}
                type="button"
                aria-pressed={isActive}
                className={`print-toolbar__language-button${isActive ? " print-toolbar__language-button--active" : ""}`}
                onClick={() => onLocaleChange(code)}
                title={labels.languages[code as keyof typeof labels.languages] || label}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : null}
      {targetNode ? (
        <button
          type="button"
          className="print-toolbar__button"
          aria-label={labels.title}
          onClick={() => handlePrint?.()}
        >
          {labels.action}
        </button>
      ) : (
        <button type="button" className="print-toolbar__button" disabled>
          {labels.action}
        </button>
      )}
    </div>
  );
};

export default PrintToolbar;
