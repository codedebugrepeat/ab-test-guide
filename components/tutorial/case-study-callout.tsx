export function CaseStudyCallout() {
  return (
    <div className="my-8 rounded-lg border border-foreground/15 bg-foreground/[0.03] px-6 py-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
        Case study
      </p>
      <p className="mb-4 text-sm text-foreground/80">
        You run a SaaS. You want more signups. You A/B tested your signup button
        copy.
      </p>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-md border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Group A — original copy
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums">
            10 / 100
          </dd>
          <dd className="mt-1 text-xs text-foreground/50">
            10 signups out of 100 visitors → <strong>10%</strong>
          </dd>
        </div>
        <div className="rounded-md border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Group B — new copy
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums">
            15 / 100
          </dd>
          <dd className="mt-1 text-xs text-foreground/50">
            15 signups out of 100 visitors → <strong>15%</strong>
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-foreground/40">
        Signup rate = signups ÷ visitors. This scenario carries through every
        section.
      </p>
    </div>
  );
}
