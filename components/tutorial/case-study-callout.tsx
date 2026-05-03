import { ExperimentIllustration } from "@/components/tutorial/illustrations/experiment-illustration";
import {
  CASE_STUDY_A_SIGNUPS,
  CASE_STUDY_B_SIGNUPS,
} from "@/components/tutorial/constants/case-study-constants";

export function CaseStudyCallout() {
  return (
    <div className="my-8 rounded-lg border border-foreground/15 bg-foreground/[0.03] px-6 py-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground/40">
        Case study
      </p>
      <ExperimentIllustration />
      <p className="mb-2 text-sm text-foreground/50">
        Sign-ups
      </p>
      <dl className="grid grid-cols-2 gap-4">
        <div className="rounded-md border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Group A
          </dt>
          <dd className="mt-1 text-4xl font-bold tabular-nums">
            {CASE_STUDY_A_SIGNUPS}
          </dd>
        </div>
        <div className="rounded-md border border-foreground/10 bg-foreground/[0.03] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Group B
          </dt>
          <dd className="mt-1 text-4xl font-bold tabular-nums">
            {CASE_STUDY_B_SIGNUPS}
          </dd>
        </div>
      </dl>
    </div>
  );
}
