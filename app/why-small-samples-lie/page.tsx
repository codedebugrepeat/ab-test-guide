import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { CaseStudyCallout } from "@/components/tutorial/case-study-callout";
import { MarbleSamplingWidget } from "@/components/tutorial/widgets/marble-sampling-widget";
import { SamplingDistributionBuilder } from "@/components/tutorial/widgets/sampling-distribution-builder";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widgets/widget-frame";
import { JarIllustration } from "@/components/tutorial/illustrations/jar-illustration";
import { SideRemark } from "@/components/tutorial/side-remark";
import { getChapter, totalChapters } from "@/components/tutorial/chapters";
import { siteConfig } from "@/lib/site-config";
import {
  CASE_STUDY_VISITORS,
  CASE_STUDY_A_SIGNUPS,
  CASE_STUDY_B_SIGNUPS,
  CASE_STUDY_A_RATE,
  CASE_STUDY_B_RATE,
} from "@/components/tutorial/constants/case-study-constants";

const chapter = getChapter(1);

export const metadata: Metadata = {
  title: chapter.browserTitle,
  description: chapter.description,
};

export default function Section1Page() {
  const aPercent = Math.round(CASE_STUDY_A_RATE * 100);
  const bPercent = Math.round(CASE_STUDY_B_RATE * 100);

  return (
    <TutorialLayout>
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
        {siteConfig.name} · Chapter {chapter.number} of {totalChapters}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        {chapter.title}
      </h1>

      <p className="mt-6 text-foreground/70">
        You ran an A/B test, the new version looked better, and you
        weren&apos;t sure whether to trust it. This guide explains why — and
        how to know for certain. Every concept has an interactive visualization
        you can play with, so you build intuition step by step. No stats
        background required.
      </p>

      <hr className="my-10 border-foreground/10" />

      <CaseStudyCallout />

      <h2 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">
        Ship version B, right?
      </h2>

      <p className="mt-4 text-foreground/70">
        It&apos;s the obvious call. But it&apos;s a trap, and the next few
        minutes will show you exactly why.
      </p>

      <p className="mt-8 text-foreground/70">
        Imagine every potential visitor is a marble in a jar. Green means they
        signed up; grey means they didn&apos;t. The jar below has a true
        conversion rate of {aPercent}%: 1 in every {Math.round(1 / CASE_STUDY_A_RATE)}, on average. Draw a sample of 10
        and count the green ones. What do you notice about the average as you
        draw more and more samples?
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        <JarIllustration />
        <WidgetFrame>
          <MarbleSamplingWidget />
        </WidgetFrame>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        What you&apos;re really looking at: sampling error
      </h2>

      <div className="mt-4 space-y-4 text-foreground/70">
        <p>
          What you just saw is <strong>sampling error</strong>: the natural
          spread in outcomes you get from a small random sample, even when
          nothing about the jar changed.
        </p>
      </div>

      <Quote>The jar&apos;s truth didn&apos;t move. Your draws did.</Quote>

      <div className="space-y-4 text-foreground/70">
        <p>
          At 10 marbles per draw, the count bounces around. Getting 0 or 1 when
          you&apos;d expect 2 is common. Getting 3 is common too. Now scale
          that up: our A/B test had {CASE_STUDY_VISITORS} visitors per group, not 10. The same
          principle applies. A gap of {CASE_STUDY_A_SIGNUPS} vs. {CASE_STUDY_B_SIGNUPS} signups is exactly the kind of
          result sampling error produces routinely, even when both variants are
          identical.
        </p>
        <p>
          More data tightens that spread. How much more? That&apos;s what the
          rest of this guide covers. But first, let&apos;s name the mistake.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        The instinct vs. the reality
      </h2>
      <div className="mt-4 space-y-4 text-foreground/70">
        <p>
          Group B converted at {bPercent}%. Group A converted at {aPercent}%. B is ahead —
          but is it ahead enough to trust?
        </p>
        <p>
          But at {CASE_STUDY_VISITORS}{" "} visitors per group, the numbers are fragile. One signup
          either way moves the conversion rate by a full percentage point.
        </p>
        <p>
          Even two <em>identical</em> versions of your button, the exact same
          copy shown to equivalent audiences, would routinely produce a gap
          like {CASE_STUDY_A_SIGNUPS} vs. {CASE_STUDY_B_SIGNUPS} by pure chance at this sample size. Random variation
          at small scales is that large.
        </p>
      </div>

      <Quote>
        At {CASE_STUDY_VISITORS} visitors per group, even two <em>identical</em> versions would
        routinely show a gap like this by pure chance.
      </Quote>

      <div className="space-y-4 text-foreground/70">
        <p>
          That means you cannot tell, from {CASE_STUDY_VISITORS} visitors per group, whether B
          is genuinely better or you got lucky. Shipping on this evidence is a
          coin flip in a trenchcoat.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Stack the draws: a shape appears
      </h2>

      <p className="mt-4 text-foreground/70">
        One draw bounces around. That&apos;s sampling error. But draw again.
        And again. Keep going and tally every result. Something happens: the
        chaos settles into a pattern.
      </p>

      <p className="mt-4 text-foreground/70">
        Below is the same marble jar. This time, instead of watching a single
        draw, you&apos;re building up a record of many draws. Each time you
        sample, the count gets stacked onto the chart. Keep adding draws and a
        shape fills in.
      </p>

      <div className="mt-6">
        <WidgetFrame>
          <SamplingDistributionBuilder />
        </WidgetFrame>
      </div>

      <div className="mt-8 space-y-4 text-foreground/70">
        <p>
          That shape has a name: a <strong>sampling distribution</strong>. The
          middle is where most outcomes land; the edges are rare. At 10 marbles
          per draw the histogram is jagged, but the tendency is already there —
          results cluster around the jar&apos;s{" "}
          <SideRemark term="true rate" /> and thin out toward the extremes.
        </p>
        <p>
          That shape isn&apos;t fixed. Its width depends on your baseline.
        </p>
      </div>

      <SectionFooter
        summary={[
          `Small samples produce noisy results. A ${CASE_STUDY_A_SIGNUPS} vs. ${CASE_STUDY_B_SIGNUPS} gap is common by chance alone.`,
          "You can't tell signal from noise without knowing how much data you actually need.",
          "Stack enough draws and the noise settles into a shape: a sampling distribution that clusters around the true rate.",
        ]}
        teaserText="Next: that shape isn't fixed. Its width depends on your baseline — and baseline is what drives how much data you need."
        nextLabel="Next: Your baseline matters →"
        nextHref="/your-baseline-matters"
      />
    </TutorialLayout>
  );
}
