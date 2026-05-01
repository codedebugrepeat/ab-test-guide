"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chapters } from "./chapters";

export function TutorialNav({
  compactNav = false,
  onNavigate,
}: {
  compactNav?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  if (compactNav) {
    return (
      <nav aria-label="Chapters">
        <ol className="space-y-2 pb-1">
          {chapters.map((ch) => {
            const active = pathname === ch.href;
            return (
              <li key={ch.href}>
                <Link
                  href={ch.href}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavigate}
                  className={`flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-[13px] transition-colors sm:text-sm ${active
                      ? "bg-foreground/[0.08] font-medium text-foreground"
                      : "text-foreground/40 hover:bg-foreground/[0.04] hover:text-foreground/70"
                    }`}
                >
                  <span className="tabular-nums text-foreground/30">
                    {ch.number}
                  </span>
                  <span className="leading-snug">{ch.shortTitle}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Chapters">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">
        Chapters
      </p>
      <ol className="space-y-0.5">
        {chapters.map((ch) => {
          const active = pathname === ch.href;
          return (
            <li key={ch.href}>
              <Link
                href={ch.href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
                className={`flex gap-3 rounded-md px-3 py-2 text-sm transition-colors ${active
                  ? "bg-foreground/[0.07] font-medium text-foreground"
                  : "text-foreground/50 hover:bg-foreground/[0.04] hover:text-foreground/70"
                  }`}
              >
                <span className="shrink-0 tabular-nums text-foreground/30">
                  {ch.number}
                </span>
                <span className="leading-snug">{ch.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
