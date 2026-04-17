"use client";

import { forwardRef } from "react";

type Variant = "primary" | "ghost" | "outline";

type Props = {
  variant?: Variant;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium px-4 h-10 transition disabled:opacity-60 disabled:cursor-not-allowed";
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-accent to-[#6a4bff] text-white shadow-glow hover:brightness-110",
  ghost: "text-ink-soft hover:text-ink hover:bg-bg-elev",
  outline: "border border-line text-ink hover:bg-bg-elev",
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
        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : null}
      {children}
    </button>
  );
});
