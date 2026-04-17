import { Activity } from "lucide-react";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-cyan shadow-glow"
        style={{ width: size, height: size }}
      >
        <Activity className="text-black" style={{ width: size * 0.6, height: size * 0.6 }} />
      </div>
      <span className="text-[15px] font-semibold tracking-tight">
        Prediction<span className="text-accent-cyan">Edge</span>
      </span>
    </div>
  );
}
