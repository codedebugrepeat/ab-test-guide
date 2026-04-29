import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widgets/widget-frame";
import { SamplingDistributionBuilder } from "@/components/tutorial/widgets/sampling-distribution-builder";
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

      <p className="mt-6 text-foreground/70">
        Small samples are noisy. You saw that in chapter 1. What wasn&apos;t
        obvious yet is that noise has a shape, and the shape depends on a
        single number: how often your visitors currently convert. Once that
        shape is on the page, &ldquo;how many visitors do I need&rdquo; stops
        being a vibe and starts being something you can answer.
      </p>

      <hr className="my-10 border-foreground/10" />

      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        The shape of noise
      </h2>

      <p className="mt-4 text-foreground/70">
        Back to the marble jar from page 1. Same {aPercent}% true rate, same 10-marble
        draw. This time, forget the single sample. Keep drawing and stack
        every count onto the chart below. You&apos;re building up a tally of
        which outcomes show up, and how often.
      </p>

      <div className="mt-6">
        <WidgetFrame>
          <SamplingDistributionBuilder />
        </WidgetFrame>
      </div>

      <div className="mt-8 space-y-4 text-foreground/70">
        <p>
          What you just stacked has a name: a{" "}
          <strong>sampling distribution</strong>. Each column is a possible
          outcome of one draw, and the height is how often that outcome has
          turned up so far. The shape is jagged because 10 marbles is a tiny
          sample and a few dozen draws is a small pile. Scale both up, to 100
          visitors per sample and many thousands of draws, and the histogram
          smooths into a bell.
        </p>
        <p>
          That bell isn&apos;t fixed, though. Its width moves with your
          baseline.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        What&apos;s a baseline?
      </h2>

      <Quote>
        Your <strong>baseline conversion rate</strong> is how many visitors
        sign up right now, before any change.
      </Quote>

      <p className="text-foreground/70">
        If 100 people hit your signup page and 4 sign up, your baseline is 4%.
        That&apos;s it.
      </p>

      <p className="mt-4 text-foreground/70">
        It sounds like background information. It isn&apos;t. Your baseline
        tells you how much signal each visitor brings, and that shapes how much
        data you need more than almost anything else.
      </p>

      <p className="mt-4 text-foreground/70">
        In the case study, version A got {CASE_STUDY_A_SIGNUPS} signups from {CASE_STUDY_VISITORS} visitors, so the
        baseline is {aPercent}%. That&apos;s on the high side. Many real signup flows
        sit somewhere between 1% and 5%, and the difference matters a lot.
        Here&apos;s what it looks like on the distribution.
      </p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Baseline changes the shape
      </h2>

      <p className="mt-4 text-foreground/70">
        Two products, both hoping a new signup button lifts conversions by {liftPercent}%. One converts at 2% today; the other at 20%. Same &ldquo;{liftPercent}%
        better&rdquo; on paper. On the distribution, they are not the same
        story.
      </p>

      <p className="mt-4 text-foreground/70">
        The widget below is the smoothed version of what you just drew,
        scaled to {CASE_STUDY_VISITORS} visitors per sample. Slide the baseline to pick a
        product. The solid line is that product&apos;s current average. The
        dashed line is where version B lands if it really does lift by {liftPercent}%.
        The question to sit with: does the lift line poke out of the bell, or
        is it still inside the average&apos;s usual wobble?
      </p>

      <div className="mt-6">
        <WidgetFrame>
          <BaselineDistributionWidget />
        </WidgetFrame>
      </div>

      <div className="mt-8 space-y-4 text-foreground/70">
        <p>
          At 2%, the lift line sits deep inside the spread. Run the test at
          {CASE_STUDY_VISITORS} visitors and you&apos;d see 2 vs. 2 one day, 2 vs. 3 the next, 3
          vs. 2 the day after. The real improvement is there; it is buried
          under the sample-to-sample bouncing.
        </p>
        <p>
          Slide the baseline up to 20% and the lift line separates from the
          average. Single samples still vary, but the gap is wide enough that
          &ldquo;B is better&rdquo; starts to hold up from one run to the
          next. Same {liftPercent}% improvement, very different picture.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        The signal-to-noise problem
      </h2>

      <div className="mt-4 space-y-4 text-foreground/70">
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
      </div>

      <Quote>
        The lower your baseline, the more data you need to hear the signal
        above the noise.
      </Quote>

      <div className="space-y-4 text-foreground/70">
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
          We&apos;ve been using {CASE_STUDY_VISITORS} visitors throughout because the numbers
          are easy to follow. Real A/B tests rarely run at that scale. By the
          time you finish this guide, you&apos;ll see that depending on your
          baseline, a well-designed experiment might need thousands of
          visitors per group, not hundreds. The examples are simple on
          purpose. The actual numbers rarely are.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Two bells
      </h2>

      <p className="mt-4 text-foreground/70">
        So far we&apos;ve drawn the control&apos;s distribution as a histogram
        of discrete counts. From here on we&apos;ll draw it as a smooth
        silhouette: same distribution, just without the individual dots. The
        semantics don&apos;t change. Sample something and you get variance;
        values cluster around the{" "}
        <SideRemark term="mean" />{" "}
        and form a bell.
      </p>

      <p className="mt-4 text-foreground/70">
        Run an A/B test and you have two groups. Each is its own sampling
        process, each has its own bell, each centered on its own mean. The
        control sits at the baseline rate; B sits at the baseline plus the
        lift as a percentage of that baseline. Here are both, at the case
        study&apos;s 10% baseline and 100 visitors per variant.
      </p>

      <div className="mt-6">
        <WidgetFrame>
          <TwoBellsWidget />
        </WidgetFrame>
      </div>

      <p className="mt-4 text-foreground/70">
        Use the slider to move the baseline. At 2%, the absolute gap between the
        two means shrinks to a fifth of what it was at 10%, and the bells almost
        sit on top of each other. Push to 20% and they pull apart. Same relative
        lift, very different picture — the same thread from earlier in this
        chapter, now with both distributions in view.
      </p>

      <SectionFooter
        summary={[
          "Noise has a shape. Keep drawing samples and that shape fills in: a sampling distribution.",
          "Baseline controls the shape. The lower the baseline, the more the spread swamps small differences.",
          "Run an A/B test and both groups have their own bell. Whether the test calls a winner depends on how far apart those bells sit.",
        ]}
        teaserText="Next: two bells, one decision. How far apart do they need to sit before you call a winner?"
        nextLabel="Next: Confidence →"
        nextHref="/how-sure-do-you-need-to-be"
      />
    </TutorialLayout>
  );
}
