"use client";

import { forwardRef } from "react";

type Variant = "primary" | "ghost" | "outline" | "mono";

type Props = {
  variant?: Variant;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium px-4 h-10 transition disabled:opacity-60 disabled:cursor-not-allowed";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-white text-bg hover:bg-ink-soft shadow-lift disabled:bg-ink-soft",
  mono: "bg-gradient-to-b from-accent to-accent-deep text-white shadow-glow hover:brightness-110",
  ghost: "text-ink-soft hover:text-ink hover:bg-white/[0.04]",
  outline:
    "border border-line-strong bg-white/[0.02] text-ink hover:bg-white/[0.05]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", loading, className = "", children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      {...props}
      disabled={disabled || loading}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
    >
      {loading ? (
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      ) : null}
      {children}
    </button>
  );
});
