import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widget-frame";
import { SamplingDistributionBuilder } from "@/components/tutorial/sampling-distribution-builder";
import { BaselineDistributionWidget } from "@/components/tutorial/baseline-distribution-widget";
import { getChapter, totalChapters } from "@/components/tutorial/chapters";
import { siteConfig } from "@/lib/site-config";

const chapter = getChapter(2);

export const metadata: Metadata = {
  title: chapter.browserTitle,
  description: chapter.description,
};

export default function Section2Page() {
  return (
    <TutorialLayout>
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
        {siteConfig.name} · Chapter {chapter.number} of {totalChapters}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        {chapter.title}
      </h1>

      <p className="mt-6 text-foreground/70">
        You know small samples lie. So the next question is obvious: how many
        visitors do you actually need? There&apos;s no universal number. It
        depends on three things, and we&apos;ll work through each one. First
        up: your baseline conversion rate.
      </p>

      <hr className="my-10 border-foreground/10" />

      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
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
        Back to our experiment: version A was getting 10 signups from 100
        visitors, a 10% baseline. That&apos;s on the high side. Many real
        signup flows convert somewhere between 1% and 5%, and the difference
        matters a lot. Here&apos;s why.
      </p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Two products, two completely different problems
      </h2>

      <p className="mt-4 text-foreground/70">
        Imagine two SaaS products, both testing new signup button copy, both
        hoping for a 20% relative lift. One converts at 2%. The other at 20%.
      </p>

      <p className="mt-4 text-foreground/70">
        At 2%, 100 visitors gives you roughly 2 signups. A 20% lift would take
        that to 2.4 — less than one extra person in a hundred. At 20%, 100
        visitors gives you 20 signups, and the same lift takes that to 24.
        Move the slider below and watch what that looks like.
      </p>

      <div className="mt-8">
        <WidgetFrame>
          <SamplingDistributionBuilder />
        </WidgetFrame>
      </div>

      <div className="mt-8">
        <WidgetFrame>
          <BaselineDistributionWidget />
        </WidgetFrame>
      </div>


      <div className="mt-8 space-y-4 text-foreground/70">
        <p>
          At low baseline, the expected gap between A and B is less than one
          signup per 100 visitors. That&apos;s smaller than the random noise
          you&apos;d get by chance. You could run the test and see 2 vs. 2, or
          2 vs. 3, or 3 vs. 2, and none of it would tell you anything. The
          signal is buried.
        </p>
        <p>
          At higher baseline, the gap grows large enough that at least
          something is visible. It&apos;s still noisy at 100 visitors, but
          there&apos;s something to work with.
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
          At 2% baseline, 100 visitors gives you roughly 2 conversions to work
          with. At 20%, the same 100 visitors gives you 20. Ten times the
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
          completely different data requirement, because the signal is that
          much rarer.
        </p>
        <p>
          This is why there&apos;s no universal answer to &ldquo;how many
          visitors do I need?&rdquo; You have to start with your own baseline.
        </p>
        <p>
          One thing worth naming: we&apos;ve been using 100 visitors throughout
          because the numbers are easy to follow. Real A/B tests don&apos;t run
          at that scale. By the time you finish this guide, you&apos;ll see that
          depending on your baseline, a well-designed experiment might need
          thousands of visitors per group, not hundreds. The examples are simple
          on purpose. The actual numbers rarely are.
        </p>
      </div>

      <SectionFooter
        summary={[
          "Your baseline is your current conversion rate before any changes.",
          "Low baseline means rare conversions, so you need much more data to detect a real difference.",
          "The same relative improvement is far harder to see at 2% than at 15%.",
        ]}
        teaserText="Next: even with the right sample size, how confident do you need to be in the result?"
        nextLabel="Next: Confidence →"
        nextHref="/how-sure-do-you-need-to-be"
      />
    </TutorialLayout>
  );
}
