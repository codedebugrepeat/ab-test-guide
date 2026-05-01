"use client";

import { useEffect, useState, type ReactNode } from "react";
import { TutorialNav } from "./tutorial-nav";

export function TutorialLayout({ children }: { children: ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (!isNavOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isNavOpen]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-12 pt-6">
      <div className="mb-6 border-b border-foreground/10 pb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setIsNavOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
          aria-haspopup="dialog"
          aria-controls="tutorial-chapters-dialog"
          aria-expanded={isNavOpen}
        >
          <span className="text-base leading-none" aria-hidden="true">
            ≡
          </span>
          Chapters
        </button>
      </div>
      {isNavOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            aria-hidden="true"
            onClick={() => setIsNavOpen(false)}
          />
          <div
            id="tutorial-chapters-dialog"
            role="dialog"
            aria-labelledby="tutorial-chapters-title"
            aria-modal="true"
            className="fixed left-0 top-0 z-50 h-full w-full max-w-xs border-r border-foreground/10 bg-background p-6 shadow-xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <p id="tutorial-chapters-title" className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
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
        </>
      )}
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
