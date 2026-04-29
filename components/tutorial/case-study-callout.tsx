import { ExperimentIllustration } from "@/components/tutorial/illustrations/experiment-illustration";
import {
  CASE_STUDY_VISITORS,
  CASE_STUDY_A_SIGNUPS,
  CASE_STUDY_B_SIGNUPS,
  CASE_STUDY_A_RATE,
  CASE_STUDY_B_RATE,
} from "@/components/tutorial/constants/case-study-constants";

export function CaseStudyCallout() {
  const aPercent = Math.round(CASE_STUDY_A_RATE * 100);
  const bPercent = Math.round(CASE_STUDY_B_RATE * 100);

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
        We ran {CASE_STUDY_VISITORS} visitors through each. Here&apos;s what we got:
      </p>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-md border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Version A
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums">
            {CASE_STUDY_A_SIGNUPS} signups
          </dd>
          <dd className="mt-1 text-xs text-foreground/50">
            out of {CASE_STUDY_VISITORS} visitors ({aPercent}%)
          </dd>
        </div>
        <div className="rounded-md border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Version B
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums">
            {CASE_STUDY_B_SIGNUPS} signups
          </dd>
          <dd className="mt-1 text-xs text-foreground/50">
            out of {CASE_STUDY_VISITORS} visitors ({bPercent}%)
          </dd>
        </div>
      </dl>

    </div>
  );
}
