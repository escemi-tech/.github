import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Resume from "./Resume";
import PrintToolbar from "./dev/PrintToolbar";
import resumeEn from "../../resume.en.json";
import resumeFr from "../../resume.fr.json";
import type { ResumeSchema } from "./types/resume";
import "./styles.css";

const RESUMES: Record<string, ResumeSchema> = {
  en: resumeEn as ResumeSchema,
  fr: resumeFr as ResumeSchema,
};

const App = () => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const initialLocale = useMemo(() => document.documentElement.lang || "en", []);
  const [locale, setLocale] = useState(initialLocale);
  const normalizedLocale = locale.split("-")[0]?.toLowerCase() || "en";
  const resumeData = RESUMES[normalizedLocale] || RESUMES.en;

  useEffect(() => {
    document.documentElement.lang = normalizedLocale;
  }, [normalizedLocale]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="preview-toolbar-host">
        <PrintToolbar targetRef={resumeRef} locale={normalizedLocale} onLocaleChange={setLocale} />
      </div>
      <div ref={resumeRef}>
        <Resume resume={resumeData} locale={normalizedLocale} />
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Unable to find #root container");
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
