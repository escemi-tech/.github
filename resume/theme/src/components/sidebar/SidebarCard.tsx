import type { ReactNode } from "react";

type SidebarCardProps = {
  title: string;
  icon: string;
  children?: ReactNode;
};

const SidebarCard = ({ title, icon, children }: SidebarCardProps) => (
  <section className="sidebar-card text-slate-700">
    <div className="mb-2.5 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
      <span aria-hidden>{icon}</span>
      {title}
    </div>
    <div className="space-y-1.5 text-[0.9rem] leading-snug text-slate-700">
      {children}
    </div>
  </section>
);

export default SidebarCard;
