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
} from "lucide-react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/picks", label: "Daily Picks", Icon: Target },
  { href: "/markets", label: "Markets", Icon: LineChart },
  { href: "/ai-chat", label: "AI Chat", Icon: Sparkles },
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
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line/70 bg-bg-soft/80 backdrop-blur px-4 py-5 sticky top-0 h-screen">
      <Link href="/dashboard" className="px-1 py-1">
        <Logo />
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {LINKS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-accent/15 text-ink shadow-[inset_0_0_0_1px_rgba(124,92,255,0.35)]"
                  : "text-ink-soft hover:text-ink hover:bg-bg-elev"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft hover:text-ink hover:bg-bg-elev transition"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
