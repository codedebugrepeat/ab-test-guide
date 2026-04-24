import { ExperimentIllustration } from "@/components/tutorial/experiment-illustration";

export function CaseStudyCallout() {
  return (
    <div className="my-8 rounded-lg border border-foreground/15 bg-foreground/[0.03] px-6 py-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
        Case study
      </p>
      <p className="mb-4 text-sm text-foreground/80">
        You have a sign-up button on your website and want to increase sign-ups.
        You A/B tested the button copy.
      </p>
      <ExperimentIllustration />
      <p className="mb-4 text-sm text-foreground/60">
        We ran 100 visitors through each. Here&apos;s what we got:
      </p>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-md border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Version A
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums">
            10 signups
          </dd>
          <dd className="mt-1 text-xs text-foreground/50">
            out of 100 visitors (10%)
          </dd>
        </div>
        <div className="rounded-md border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Version B
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums">
            15 signups
          </dd>
          <dd className="mt-1 text-xs text-foreground/50">
            out of 100 visitors (15%)
          </dd>
        </div>
      </dl>

    </div>
  );
}
