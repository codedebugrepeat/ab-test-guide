import type { Metadata } from "next";
import { Container } from "@/components/container";
import { CaseStudyCallout } from "@/components/tutorial/case-study-callout";
import { MarbleSamplingWidget } from "@/components/tutorial/marble-sampling-widget";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";

export const metadata: Metadata = {
  title: "A/B Testing — From Zero to Confident",
  description:
    "A hands-on guide to A/B testing with interactive visualizations. No assumed theory, just clear explanations, a running example, and a calculator you'll actually know how to use.",
};

export default function Section1Page() {
  return (
    <Container>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        A/B Testing from first principles
      </h1>
      <div className="mt-5 rounded-lg border border-foreground/15 bg-foreground/[0.03] px-6 py-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Interactive guide
        </p>
        <p className="text-foreground/80">
          Every concept has a visualization you can play with, starting with
          pulling marbles from a jar. You&apos;ll build real intuition for the
          levers that drive experiment results: sample size, baseline rate, the
          lift you&apos;re trying to detect. No stats background required. We
          walk through each one step by step, so you can run your experiments
          with confidence.
        </p>
      </div>

      <div className="mt-8 space-y-3 text-foreground/70">
        <p>
          You ran an A/B test. The new version got more sign-ups. You
          weren&apos;t sure whether to ship it. Or you opened a sample-size
          calculator, hit a wall of jargon (statistical power, significance
          thresholds, baseline conversion rates) and closed the tab.
        </p>
        <p>
          This guide starts from scratch. Each section builds on the last. By
          the end you&apos;ll know exactly what the calculator is doing and why.
        </p>
      </div>

      <hr className="my-10 border-foreground/10" />

      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Why you can&apos;t trust your experiment with a small sample size
      </h2>

      <CaseStudyCallout />

      <h2 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">
        I ran the experiment and sign-ups went from 10 to 15. Ship version B,
        right?
      </h2>

      <p className="mt-4 text-foreground/70">
        It&apos;s the obvious call. But it&apos;s a trap, and the next few
        minutes will show you exactly why.
      </p>

      <p className="mt-8 text-foreground/70">
        Imagine every potential visitor is a marble in a jar. Green means they
        signed up; grey means they didn&apos;t. The jar below has a true
        conversion rate of 20%: 2 in every 10, on average. Draw a sample of 10
        and count the green ones.
      </p>

      <div className="mt-6">
        <MarbleSamplingWidget />
      </div>

      <div className="mt-6 space-y-4 text-foreground/70">
        <p>
          What you just saw is <strong>sampling error</strong>: the natural
          spread in outcomes you get from a small random sample, even when
          nothing about the jar changed.
        </p>
      </div>

      <Quote>The jar&apos;s truth didn&apos;t move. Your draws did.</Quote>

      <div className="space-y-4 text-foreground/70">
        <p>
          At 10 marbles per draw, the count bounces around. Getting 1 when
          you&apos;d expect 2 is common. Getting 3 is common too. Now scale
          that up: our A/B test had 100 visitors per group, not 10. The same
          principle applies. A gap of 10 vs. 15 signups is exactly the kind of
          result sampling error produces routinely, even when both variants are
          identical.
        </p>
        <p>
          More data tightens that spread. How much more? That&apos;s what the
          rest of this guide covers. But first, let&apos;s name the mistake.
        </p>
      </div>

      <h2 className="mt-8 text-xl font-semibold tracking-tight">
        The instinct: B beat A, so ship B
      </h2>
      <p className="mt-3 text-foreground/70">
        Group B converted at 15%. Group A converted at 10%. That&apos;s a
        five-point gap, 50% better in relative terms. The data is right there.
        Of course you ship the winner.
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
          Even two <em>identical</em> versions of your button, the exact same
          copy shown to equivalent audiences, would routinely produce a gap like
          10 vs. 15 by pure chance at this sample size. Random variation at
          small scales is that large.
        </p>
      </div>

      <Quote>
        At 100 visitors per group, even two <em>identical</em> versions would
        routinely show a gap like this by pure chance.
      </Quote>

      <div className="space-y-4 text-foreground/70">
        <p>
          That means you cannot tell, from 100 visitors per group, whether B is
          genuinely better or you got lucky. Shipping on this evidence is a coin
          flip in a trenchcoat.
        </p>
      </div>

      <SectionFooter
        summary={[
          "Small samples produce noisy results. A 10 vs. 15 gap is common by chance alone.",
          "You can't tell signal from noise without knowing how much data you actually need.",
          "That's what the rest of this guide covers.",
        ]}
        teaserText="Next: where does the number of visitors you need actually come from?"
        nextLabel="Next: Sample size →"
      />
    </Container>
  );
}
