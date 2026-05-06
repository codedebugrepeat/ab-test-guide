"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import type { ReactNode } from "react";

interface SectionFooterProps {
  summary: ReactNode[];
  teaserText: string;
  nextLabel: string;
  nextHref: string;
}

export function SectionFooter({
  summary,
  teaserText,
  nextLabel,
  nextHref,
}: SectionFooterProps) {
  const pathname = usePathname();

  function handleNextClick() {
    posthog.capture("section_next_clicked", {
      from_href: pathname,
      next_href: nextHref,
      next_label: nextLabel,
    });
  }

  return (
    <div className="mt-12 rounded-xl border border-foreground/15 bg-foreground/[0.04] px-8 py-7">
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
        What we learned
      </p>
      <ul className="mt-4 space-y-2">
        {summary.map((item, i) => (
          <li key={i} className="flex gap-2 text-foreground/70">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-foreground/50">{teaserText}</p>
      <Link
        href={nextHref}
        onClick={handleNextClick}
        className="mt-5 inline-block rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background"
      >
        {nextLabel}
      </Link>
    </div>
  );
}
