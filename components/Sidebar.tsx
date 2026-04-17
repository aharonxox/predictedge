"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  LineChart,
  Sparkles,
  Settings,
  LogOut,
  Command,
} from "lucide-react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/picks", label: "Daily picks", Icon: Target },
  { href: "/markets", label: "Markets", Icon: LineChart },
  { href: "/ai-chat", label: "AI chat", Icon: Sparkles },
  { href: "/account", label: "Account", Icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-line/60 bg-bg-soft/60 backdrop-blur-xl px-4 py-5 sticky top-0 h-screen">
      <Link href="/dashboard" className="px-1 py-1 inline-flex">
        <Logo />
      </Link>

      <div className="mt-5 rounded-lg border border-line bg-bg-card/60 px-3 py-2 flex items-center justify-between text-xs text-ink-mute">
        <div className="flex items-center gap-1.5">
          <Command className="h-3.5 w-3.5" />
          <span>Quick find</span>
        </div>
        <span className="kbd">⌘K</span>
      </div>

      <nav className="mt-6 flex flex-col gap-0.5">
        <div className="px-2 pb-2 text-[11px] font-mono uppercase tracking-[0.2em] text-ink-mute">
          Workspace
        </div>
        {LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition ${
                active
                  ? "text-ink bg-gradient-to-r from-accent/15 to-transparent"
                  : "text-ink-soft hover:text-ink hover:bg-white/[0.03]"
              }`}
            >
              {active ? (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-gradient-to-b from-accent to-accent-cyan" />
              ) : null}
              <Icon
                className={`h-4 w-4 ${active ? "text-accent" : "text-ink-mute group-hover:text-ink-soft"}`}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <div className="rounded-lg border border-line bg-bg-card/60 p-3 text-xs">
          <div className="flex items-center gap-1.5 text-ink-mute mb-1.5">
            <span className="dot" />
            <span>Status</span>
          </div>
          <div className="text-ink-soft">All systems operational</div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-ink-soft hover:text-ink hover:bg-white/[0.04] transition"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
