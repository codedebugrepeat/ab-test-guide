import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CaseStudyCallout } from "@/components/tutorial/case-study-callout";

export const metadata: Metadata = {
  title: "Why You Can't Trust Your Experiment",
  description:
    "Your A/B test showed a clear winner — but can you trust it? Learn why small samples produce misleading results and how to tell a real signal from lucky noise.",
};

export default function Section1Page() {
  return (
    <Container>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        100 visitors. 15 signups vs. 10. Ship the winner, right?
      </h1>

      <p className="mt-6 text-foreground/70">
        Almost everyone makes this call. The numbers point one way, the
        conclusion feels obvious, and waiting longer just means leaving money on
        the table. But the obvious conclusion here is wrong — and the next few
        minutes will show you exactly why.
      </p>

      <CaseStudyCallout />

      <h2 className="mt-8 text-xl font-semibold tracking-tight">
        The instinct: B beat A, so ship B
      </h2>
      <p className="mt-3 text-foreground/70">
        Group B converted at 15% versus Group A&apos;s 10% — a five-point gap.
        B is 50% better in relative terms. The data is right there. Of course
        you implement the better one.
      </p>

      <h2 className="mt-8 text-xl font-semibold tracking-tight">
        Why that conclusion is premature
      </h2>
      <div className="mt-3 space-y-4 text-foreground/70">
        <p>
          At 100 visitors per group, the numbers are fragile. One signup either
          way moves the conversion rate by a full percentage point. The
          difference between &ldquo;10%&rdquo; and &ldquo;11%&rdquo; is a
          single person.
        </p>
        <p>
          Even two <em>identical</em> versions of your button — the exact same
          copy, shown to equivalent audiences — would routinely produce a gap
          like 10 vs. 15 by pure chance at this sample size. Random variation at
          small scales is that large.
        </p>
        <p>
          That means you cannot tell, from 100 visitors per group, whether B is
          genuinely better or you got lucky. Shipping on this evidence is a coin
          flip in a trenchcoat.
        </p>
      </div>

      <p className="mt-8 text-foreground/50">
        How many visitors <em>would</em> it take? That depends on a few
        things — unpacked in the next sections.
      </p>
    </Container>
  );
}
