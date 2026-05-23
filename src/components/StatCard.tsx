interface Props {
  label: string;
  count: number;
  color: string;
  active: boolean;
  onClick: () => void;
}

export default function StatCard({ label, count, color, active, onClick }: Props) {
  return (
    <div
      className="stat-card"
      style={{
        color,
        borderColor: active ? color : 'transparent',
        boxShadow: active ? `0 4px 12px rgba(0,0,0,.1)` : undefined,
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="stat-count">{count}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
