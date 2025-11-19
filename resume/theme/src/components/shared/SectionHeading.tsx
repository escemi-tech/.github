type SectionHeadingProps = {
  icon: string;
  label: string;
  tone?: "bright" | "muted";
};

const SectionHeading = ({ icon, label, tone = "bright" }: SectionHeadingProps) => {
  const color = tone === "bright" ? "text-[#1c3144]" : "text-slate-500";
  return (
    <div className={`section-title ${color}`}>
      <span aria-hidden>{icon}</span>
      {label}
    </div>
  );
};

export default SectionHeading;
