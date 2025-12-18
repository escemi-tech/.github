type RunningHeaderProps = {
  name: string;
  title: string;
};

export function RunningHeader({ name, title }: RunningHeaderProps) {
  return (
    <div className="running-header" aria-hidden="true">
      <div className="running-header__name">{name}</div>
      <div className="running-header__title">{title}</div>
    </div>
  );
}
