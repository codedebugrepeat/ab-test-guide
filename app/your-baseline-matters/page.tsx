import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widgets/widget-frame";
import { BaselineDistributionWidget } from "@/components/tutorial/widgets/baseline-distribution-widget";
import { TwoBellsWidget } from "@/components/tutorial/widgets/two-bells-widget";
import { getChapter, totalChapters } from "@/components/tutorial/chapters";
import { SideRemark } from "@/components/tutorial/side-remark";
import { siteConfig } from "@/lib/site-config";
import {
  CASE_STUDY_VISITORS,
  CASE_STUDY_A_SIGNUPS,
  CASE_STUDY_A_RATE,
} from "@/components/tutorial/constants/case-study-constants";
import { CH2_LIFT } from "@/components/tutorial/constants/chapter-2-constants";

const chapter = getChapter(2);

export const metadata: Metadata = {
  title: chapter.browserTitle,
  description: chapter.description,
};

export default function Section2Page() {
  const aPercent = Math.round(CASE_STUDY_A_RATE * 100);
  const liftPercent = Math.round(CH2_LIFT * 100);

  return (
    <TutorialLayout>
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
        {siteConfig.name} · Chapter {chapter.number} of {totalChapters}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        {chapter.title}
      </h1>

      <div className="prose mt-6">
        <p>
          In chapter 1, we learned that we can&apos;t trust small samples. For our A/B tests to be reliable, we need larger samples.
          How big a sample depends on three things.
        </p>

        <p> Let&apos;s look at the first of them: your baseline conversion rate.
          In other words, how many visitors convert right now, before you make any changes?
        </p>

        <hr />

        <h2>What&apos;s a baseline?</h2>

        <Quote>
          Your <strong>baseline conversion rate</strong> is how many visitors
          sign up right now, before any change.
        </Quote>

        <p>
          If 100 people hit your signup page and 4 sign up, your baseline is 4%.
          That&apos;s it.
        </p>

        <p>
          It sounds like background information. It isn&apos;t. Your baseline
          tells you how much signal each visitor brings, and that shapes how much
          data you need more than almost anything else.
        </p>

        <p>
          In the case study, version A got {CASE_STUDY_A_SIGNUPS} signups from {CASE_STUDY_VISITORS} visitors, so the
          baseline is {aPercent}% — your best estimate of the page&apos;s true rate.
          That&apos;s on the high side. Many real signup flows might sit somewhere between
          1% and 5%, and the difference matters a lot.
        </p>

        <h2>Low baseline hides the lift</h2>

        <p>
          Let&apos;s imagine that in our A/B test, version B lifts signups by {liftPercent}%.

          Whether we see that lift clearly depends on the baseline. At 5% baseline, a {liftPercent}% lift is a 0.1 percentage point increase, from 5% to 5.1%.

          However, if your baseline is 50%, the same {liftPercent}% lift is a 0.5 percentage point increase, from 50% to 50.5%.
        </p>

        <p>The higher the baseline, the bigger the absolute difference for the same relative lift, and the easier it is to detect that difference with a given sample size.</p>

        <p>
          Now it&apos;s your turn again. Move the slider to change the baseline (conversion rate of version A). Notice the blue dotted line - it is a 10% improvement over the baseline.
        </p>

        <p>
          When is it clearly different from your average? And when does it hide in your data?
        </p>

        <div className="not-prose mt-6">
          <WidgetFrame>
            <BaselineDistributionWidget />
          </WidgetFrame>
        </div>

        <p>
          At a low baseline, the lift line hides in a small signal. If the blue line is the reading you got from your B group, it would be hard to tell if it&apos;s really an improvement or just a random variance within your data.
        </p>
        <p>
          At a high baseline, the lift line is further away from the average, and it would be easier to spot as a real improvement.
        </p>

        <h2>The signal-to-noise problem</h2>

        <p>
          When your baseline is low, most visitors leave without converting.
          They give you no signal. You&apos;re waiting for a rare event, and
          rare events need a lot of observations before the count stabilises
          enough to detect a real difference.
        </p>
        <p>
          At 2% baseline, {CASE_STUDY_VISITORS} visitors gives you roughly 2 conversions to work
          with. At 20%, the same {CASE_STUDY_VISITORS} visitors gives you 20. Ten times the
          signal, same traffic.
        </p>

        <Quote>
          The lower your baseline, the more data you need to hear the signal
          above the noise.
        </Quote>

        <p>
          That gap compounds fast. A landing page at 2% baseline typically
          needs 10 to 20 times more visitors than a checkout flow at 30% to
          run the same test at the same confidence. Same relative improvement,
          very different data requirement, because the signal is that much
          rarer.
        </p>
        <p>
          That&apos;s why there&apos;s no universal answer to &ldquo;how many
          visitors do I need?&rdquo; You start with your own baseline.
        </p>
        <p>
          We&apos;ve been using {CASE_STUDY_VISITORS}{" "} visitors throughout because the numbers
          are easy to do percentage math in our head with. Real A/B tests rarely run at that scale. By the
          time you finish this guide, you&apos;ll see that depending on your
          baseline, a well-designed experiment might need thousands of
          visitors per group, not hundreds. The examples are simple on
          purpose. The actual numbers rarely are.
        </p>

        <Quote>A well-designed experiment might need thousands of visitors per group, not hundreds.</Quote>

        <h2>A more standard visualization</h2>

        <h3>Smooth curves</h3>

        <p>
          Before we wrap up this chapter, let&apos;s visualize the two groups in a simplified way. This will help us in the remaining chapters.

          In chapter 1, you stacked counts of marbles. If you did it often enough, it would resemble a bell shape. Since you counted finite marbles, we showed it as a discrete distribution.

          Meaning, there were gaps between the dots, and the dots represented actual counts of marbles.
        </p>

        <p>
          Going forward, let&apos; smoothen the curve out by imagining to draw the shape of the distribution instead of individual marbles. The shape is the same, it just doesn&apos;t have the individual dots anymore.
        </p>

        <h3>Two bell shapes</h3>

        <p>Another change we will make is to also draw a bell shape for the B group.

          In the last interactive widget, you already saw the bell shape for the A group. For the B group, we only showed its <SideRemark term="mean" /> as a blue dotted line.

          Now we will draw the bell for the B group as well, so you can see how much it overlaps with the A group. The more they overlap, the harder it is to tell them apart.
        </p>


        <div className="not-prose mt-6">
          <WidgetFrame>
            <TwoBellsWidget />
          </WidgetFrame>
        </div>

        <p>
          Use the slider to move the baseline. At 2%, the absolute gap between the
          two means shrinks to a tenth of what it was at 20%, and the bells almost
          sit on top of each other. Push to 20% and they pull apart. Same relative
          lift, very different picture — the same thread from earlier in this
          chapter, now with both distributions in view.
        </p>
      </div>

      <SectionFooter
        summary={[
          "Your baseline is your current conversion rate — and it's the biggest driver of how much data you need.",
          "Baseline controls the shape. The lower the baseline, the more the spread swamps small differences.",
          "Run an A/B test and both groups have their own bell. Whether the test calls a winner depends on how far apart those bells sit.",
        ]}
        teaserText="Next: the bells are set. Now decide what gap is worth chasing — and how small a lift you actually need to detect."
        nextLabel="Next: Effect size →"
        nextHref="/how-big-a-jump-are-you-looking-for"
      />
    </TutorialLayout>
  );
}
