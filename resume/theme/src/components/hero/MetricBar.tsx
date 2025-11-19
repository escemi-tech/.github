type MetricBarProps = {
  metrics?: string[];
};

const MetricBar = ({ metrics }: MetricBarProps) => {
  if (!metrics?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {metrics.map((metric, index) => (
        <span key={`metric-${index}`} className="metric-chip">
          {metric}
        </span>
      ))}
    </div>
  );
};

export default MetricBar;
