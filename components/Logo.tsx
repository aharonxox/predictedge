export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent-cyan to-accent-rose opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-tl from-black/30 to-transparent mix-blend-overlay" />
        <svg
          viewBox="0 0 32 32"
          className="relative z-10"
          style={{ width: size * 0.62, height: size * 0.62 }}
          fill="none"
        >
          <path
            d="M5 22 L11 14 L16 18 L22 7 L27 12"
            stroke="#0B0D14"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-[15px] font-semibold tracking-tight">
        Prediction
        <span className="bg-gradient-to-r from-accent-cyan to-accent bg-clip-text text-transparent">
          Edge
        </span>
      </span>
    </div>
  );
}
