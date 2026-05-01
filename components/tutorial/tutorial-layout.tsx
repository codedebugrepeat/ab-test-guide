"use client";

import { useState, type ReactNode } from "react";
import { TutorialNav } from "./tutorial-nav";

export function TutorialLayout({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-12 pt-6 sm:pt-10">
      <div className="mb-6 border-b border-foreground/10 pb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setIsNavOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
          aria-haspopup="dialog"
          aria-expanded={isNavOpen}
        >
          <span className="text-base leading-none" aria-hidden="true">
            ≡
          </span>
          Chapters
        </button>
      </div>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${isNavOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        aria-hidden={!isNavOpen}
        onClick={() => setIsNavOpen(false)}
      />
      <div
        role="dialog"
        aria-label="Chapters"
        aria-modal="true"
        className={`fixed left-0 top-0 z-50 h-full w-full max-w-xs border-r border-foreground/10 bg-background p-6 shadow-xl transition-transform lg:hidden ${isNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Chapters
          </p>
          <button
            type="button"
            onClick={() => setIsNavOpen(false)}
            className="rounded-full px-2 py-1 text-sm text-foreground/60 transition hover:text-foreground"
            aria-label="Close chapters"
          >
            Close
          </button>
        </div>
        <div className="mt-4">
          <TutorialNav compactNav onNavigate={() => setIsNavOpen(false)} />
        </div>
      </div>
      <div className="flex gap-12">
        <div className="min-w-0 flex-1">{children}</div>
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-8">
            <TutorialNav />
          </div>
        </aside>
      </div>
    </div>
  );
}
