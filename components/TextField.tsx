"use client";

import { forwardRef } from "react";

type Props = {
  label: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, hint, className = "", ...props },
  ref,
) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-ink-soft text-[12.5px] font-medium tracking-tight">
        {label}
      </span>
      <input
        ref={ref}
        {...props}
        className={`h-11 rounded-lg border border-line bg-bg-card/80 px-3.5 text-[14px] text-ink placeholder:text-ink-mute focus:border-accent/60 focus:bg-bg-elev focus:shadow-[0_0_0_4px_rgba(124,92,255,0.12)] outline-none transition ${className}`}
      />
      {hint ? <span className="text-xs text-ink-mute">{hint}</span> : null}
    </label>
  );
});
