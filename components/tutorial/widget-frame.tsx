import type { ReactNode } from "react";

export function WidgetFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6">
      <div className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
        </svg>
        Interactive
      </div>
      {children}
    </div>
  );
}
