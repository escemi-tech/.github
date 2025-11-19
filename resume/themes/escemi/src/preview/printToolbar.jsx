import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ReactToPrint from "react-to-print";

const getLocaleLabel = (locale = "en") => {
  const lang = locale?.split("-")[0]?.toLowerCase();
  switch (lang) {
    case "fr":
      return {
        title: "Imprimer le CV",
        action: "Imprimer le CV",
      };
    default:
      return {
        title: "Print resume",
        action: "Print resume",
      };
  }
};

const PrintToolbar = () => {
  const [targetNode, setTargetNode] = useState(null);
  const locale = document.documentElement?.lang || "en";
  const labels = getLocaleLabel(locale);
  const documentTitle = document.title || labels.title;

  useEffect(() => {
    const resolvedTarget = document.querySelector(".resume-root");
    if (resolvedTarget) {
      setTargetNode(resolvedTarget);
      return;
    }

    const observer = new MutationObserver(() => {
      const candidate = document.querySelector(".resume-root");
      if (candidate) {
        setTargetNode(candidate);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const pageStyle = `
    @page {
      size: A4;
      margin: 12mm 12mm 15mm;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;

  return (
    <div className="print-toolbar" role="region" aria-live="polite">
      {targetNode ? (
        <ReactToPrint
          content={() => targetNode}
          pageStyle={pageStyle}
          trigger={() => (
            <button
              type="button"
              className="print-toolbar__button"
              aria-label={labels.title}
            >
              {labels.action}
            </button>
          )}
          documentTitle={documentTitle}
        />
      ) : (
        <button type="button" className="print-toolbar__button" disabled>
          {labels.action}
        </button>
      )}
    </div>
  );
};

const mountToolbar = () => {
  const host = document.getElementById("preview-toolbar");
  if (!host) {
    return;
  }

  const root = createRoot(host);
  root.render(<PrintToolbar />);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountToolbar);
} else {
  mountToolbar();
}
