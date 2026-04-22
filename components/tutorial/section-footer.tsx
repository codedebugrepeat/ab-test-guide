import Link from "next/link";


interface SectionFooterProps {
  summary: string[];
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
  return (
    <div className="mt-12 rounded-xl border border-foreground/15 bg-foreground/[0.04] px-8 py-7">
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
        What we learned
      </p>
      <ul className="mt-4 space-y-2">
        {summary.map((item) => (
          <li key={item} className="flex gap-2 text-foreground/70">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-foreground/50">{teaserText}</p>
      <Link
        href={nextHref}
        className="mt-5 inline-block rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        {nextLabel}
      </Link>
    </div>
  );
}
