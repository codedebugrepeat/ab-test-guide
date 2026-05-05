import type { ReactNode } from "react";

export function IllustrationFrame({ children }: { children: ReactNode }) {
    return (
        <div className="w-full rounded-xl border border-foreground/10 p-4 sm:p-6">
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
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                </svg>
                Illustration
            </div>
            {children}
            <p className="mt-4 text-xs text-foreground/45">Static illustration (not interactive).</p>
        </div>
    );
}
