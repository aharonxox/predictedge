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
      <span className="text-ink-soft">{label}</span>
      <input
        ref={ref}
        {...props}
        className={`h-10 rounded-lg border border-line bg-bg-card px-3 text-[14px] text-ink placeholder:text-ink-mute focus:border-accent/60 focus:bg-bg-elev outline-none transition ${className}`}
      />
      {hint ? <span className="text-xs text-ink-mute">{hint}</span> : null}
    </label>
  );
});
