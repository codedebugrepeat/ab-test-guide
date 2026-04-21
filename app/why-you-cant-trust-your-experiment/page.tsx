import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CaseStudyCallout } from "@/components/tutorial/case-study-callout";
import { MarbleSamplingWidget } from "@/components/tutorial/marble-sampling-widget";

export const metadata: Metadata = {
  title: "A/B Testing — From Zero to Confident",
  description:
    "A hands-on guide to A/B testing with interactive visualizations. No assumed theory — just clear explanations, a running example, and a calculator you'll actually know how to use.",
};

export default function Section1Page() {
  return (
    <Container>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        A/B Testing from first principles
      </h1>
      <p className="mt-4 text-lg text-foreground/60">
        The interactive guide that explains the math behind the numbers — so you
        can run experiments with confidence, not guesswork.
      </p>

      <div className="mt-8 space-y-3 text-foreground/70">
        <p>
          Maybe you&apos;ve run an A/B test and aren&apos;t sure whether to
          trust the result. Maybe you&apos;ve tried a sample-size calculator and
          hit a wall of jargon — statistical power, significance thresholds,
          baseline conversion rates — with no explanation of what any of it
          means or where those numbers come from.
        </p>
        <p>
          This guide starts from scratch. Each section builds on the last, with
          interactive visuals that let you see the concepts in motion rather than
          just read about them. By the end you&apos;ll understand exactly what
          the calculator is doing and why — and you&apos;ll have the calculator
          too.
        </p>
      </div>

      <hr className="my-10 border-foreground/10" />

      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        100 visitors. 15 signups vs. 10. Ship the winner, right?
      </h2>

      <p className="mt-4 text-foreground/70">
        Almost everyone makes this call. The numbers point one way, the
        conclusion feels obvious, and waiting longer just means leaving money on
        the table. But the obvious conclusion here is wrong — and the next few
        minutes will show you exactly why.
      </p>

      <CaseStudyCallout />

      <p className="mt-8 text-foreground/70">
        Imagine every potential visitor is a marble in a jar. Green means they
        signed up; grey means they didn&apos;t. The jar below has a true
        conversion rate baked in — 20%, so 2 in every 10 on average. Draw a
        sample of 10 and count the green ones.
      </p>

      <div className="mt-6">
        <MarbleSamplingWidget />
      </div>

      <div className="mt-6 space-y-4 text-foreground/70">
        <p>
          What you just saw is <strong>sampling error</strong> — the natural
          spread in outcomes you get when drawing a small random sample, even
          when nothing about the jar changed. The jar&apos;s truth didn&apos;t
          move; your draws did.
        </p>
        <p>
          At 10 marbles per draw, the count bounces around considerably.
          Getting 1 when the expected value is 2 is common. Getting 3 is common
          too. Now scale that up: our A/B test had 100 visitors per group, not
          10 — but the same principle applies. A raw gap of 10 vs. 15 signups
          is the kind of gap that sampling error produces routinely, even when
          both variants are identical.
        </p>
        <p>
          Sample size is the lever that tightens this spread. We&apos;ll come
          back to exactly how much — but first, let&apos;s name the mistake.
        </p>
      </div>

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
