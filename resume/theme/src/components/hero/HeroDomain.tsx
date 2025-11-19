import React from "react";
import ContactInlineList from "./ContactInlineList";
import MetricBar from "./MetricBar";
import { sanitize, displayUrl } from "../../utils/resumeHelpers";
import { safeUrl } from "../../core";
import type { Basics } from "../../types/resume";

type ContactItem = {
  icon: string;
  label: string;
  link?: string;
};

type HeroDomainProps = {
  basics: Basics;
  summary: string;
  metrics: string[];
};

const HeroDomain = ({ basics, summary, metrics }: HeroDomainProps) => {
  const locationLabel = basics.location
    ? [basics.location.city, basics.location.region].filter(Boolean).join(", ")
    : null;

  const contactItems = (
    [
      locationLabel && { icon: "📍", label: locationLabel },
      basics.email && {
        icon: "✉️",
        label: basics.email,
        link: safeUrl(`mailto:${basics.email}`),
      },
      basics.phone && { icon: "📞", label: basics.phone },
      basics.url && {
        icon: "🔗",
        label: displayUrl(basics.url),
        link: safeUrl(basics.url),
      },
    ].filter(Boolean) as ContactItem[]
  );

  const profileItems = (basics.profiles || [])
    .filter((profile) => profile?.url)
    .map((profile) => ({
      icon: "☍",
      label: profile.network
        ? `${profile.network} · ${displayUrl(profile.url as string)}`
        : displayUrl(profile.url as string),
      link: safeUrl(profile.url as string),
    }));

  const sanitizedSummary = sanitize(summary);
  const sanitizedLabel = sanitize(basics.label);

  return (
    <div className="glow-panel px-4 py-3 space-y-2.5">
      <div className="hero-profile-row relative z-10 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        {basics.image && (
          <div className="mx-auto h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl sm:mx-0">
            <img
              src={basics.image}
              alt={basics.name || "Profile"}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="space-y-2 sm:pl-3">
          <div className="flex flex-wrap items-center gap-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.35em] text-slate-500">
            {sanitizedLabel && <span>{sanitizedLabel}</span>}
          </div>
          <div className="space-y-2.5">
            <h1 className="text-[1.95rem] font-bold text-[#1c3144] drop-shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
              {basics.name}
            </h1>
            <MetricBar metrics={metrics} />
            {sanitizedSummary && (
              <p className="whitespace-pre-line text-[0.9rem] leading-relaxed text-slate-700">
                {sanitizedSummary}
              </p>
            )}
          </div>
        </div>
      </div>
      {(contactItems.length > 0 || profileItems.length > 0) && (
        <div className="hero-contact-row">
          {contactItems.length > 0 && <ContactInlineList items={contactItems} />}
          {profileItems.length > 0 && (
            <ContactInlineList items={profileItems} tone="muted" />
          )}
        </div>
      )}
    </div>
  );
};

export default HeroDomain;
