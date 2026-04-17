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
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute inset-0 aurora" />
      <header className="relative z-10 px-6 py-5">
        <Link href="/" className="inline-flex">
          <Logo />
        </Link>
      </header>

      <div className="relative z-10 px-4 pb-16 pt-4 flex justify-center">
        <div className="w-full max-w-md">
          <div className="gradient-border">
            <div className="p-7 md:p-8">
              <h1 className="text-[22px] font-semibold tracking-tightest">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
              <div className="mt-6">{children}</div>
              {footer ? (
                <div className="mt-6 text-sm text-ink-soft">{footer}</div>
              ) : null}
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-ink-mute">
            No billing. No subscription. 10 days on us.
          </p>
        </div>
      </div>
    </div>
  );
}
