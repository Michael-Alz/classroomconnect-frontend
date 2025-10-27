interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-blue-100 rounded-full h-3 shadow-inner">
      <div
        className="h-3 rounded-full transition-all duration-300"
        style={{
          width: `${percentage}%`,
          background: "linear-gradient(90deg,#6EE7B7 0%,#0AC5FF 100%)",
          boxShadow: "0 1px 4px rgba(10,197,255,0.35)",
        }}
      />
    </div>
  );
}
