import Link from "next/link";
import { Logo } from "./Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen hero-grid">
      <header className="px-6 py-5">
        <Link href="/">
          <Logo />
        </Link>
      </header>
      <div className="px-6 pb-16 pt-6 flex justify-center">
        <div className="w-full max-w-md rounded-2xl glass p-7 shadow-glow">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? (
            <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
          {footer ? <div className="mt-6 text-sm text-ink-soft">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
