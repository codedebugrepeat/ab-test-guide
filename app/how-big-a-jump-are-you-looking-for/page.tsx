import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widgets/widget-frame";
import { LiftEffectWidget } from "@/components/tutorial/widgets/lift-effect-widget";
import { getChapter, totalChapters } from "@/components/tutorial/chapters";
import { siteConfig } from "@/lib/site-config";

const chapter = getChapter(4);

export const metadata: Metadata = {
  title: chapter.browserTitle,
  description: chapter.description,
};

export default function Section4Page() {
  return (
    <TutorialLayout>
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
        {siteConfig.name} · Chapter {chapter.number} of {totalChapters}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        {chapter.title}
      </h1>

      <p className="mt-6 text-foreground/70">
        Chapter 3 left you with a chart and a line on it. The line was the
        decision threshold. Where you put it was a policy call: more confidence
        moves it further from A&apos;s mean, and a real win has to clear it. One
        lever in that picture has been pinned the whole time without anyone
        making a fuss about it: the lift. Every chart in this guide so far has
        assumed B&apos;s jar converts 10% better than A&apos;s. That number was
        never given to you by the data. You picked it.
      </p>

      <hr className="my-10 border-foreground/10" />

      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        You choose what counts as a win
      </h2>

      <p className="mt-4 text-foreground/70">
        Before you run a test, you have to decide the smallest lift that would
        actually change what you ship. A 0.2% lift on checkout might be worth
        millions. A 0.2% lift on a corner of the app no one uses might not be
        worth the engineering follow-up. The number you settle on is your
        minimum detectable effect. It&apos;s shorthand for &ldquo;this is the
        smallest jump I want my test to be able to see.&rdquo;
      </p>

      <p className="mt-4 text-foreground/70">
        Tests don&apos;t hand this number back to you. It&apos;s an input. A
        product call dressed in stats clothing.
      </p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Smaller jumps hide. Bigger ones don&apos;t.
      </h2>

      <p className="mt-4 text-foreground/70">
        Here is the same chart you ended chapter 3 on, with the same threshold
        line at 95% confidence. The lever this time is the lift. Drag it down
        and B&apos;s bell slides toward A&apos;s. Drag it up and the bells pull
        apart on their own. Watch the gray region: that&apos;s the part of B
        that lands short of the line. It&apos;s the share of real wins your
        test would miss.
      </p>

      <div className="mt-6">
        <WidgetFrame>
          <LiftEffectWidget />
        </WidgetFrame>
      </div>

      <div className="mt-8 space-y-4 text-foreground/70">
        <p>
          At a 2% lift the bells almost coincide. Most of B sits in the gray.
          Even with 1,000 visitors per side, B&apos;s mean barely pokes past
          the line. A test like this clears almost never, no matter how
          patient you are.
        </p>
        <p>
          At a 50% lift the gray is gone. B sits comfortably to the right of
          the line and a test clears quickly. The lift is so big the data
          barely has to do any work.
        </p>
        <p>
          The case study&apos;s 10% lift sits in the awkward middle. Plenty of
          gray, plenty of overlap, B&apos;s mean nudging the line. That&apos;s
          why the case study has been a hard test all along. Not because the
          stats are mean, but because the lift you&apos;re hunting is small.
        </p>
      </div>

      <Quote>
        Aim small and the price is steep. Aim big and you might miss the win
        that was actually there.
      </Quote>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Four levers, one knob
      </h2>

      <p className="mt-4 text-foreground/70">
        Every lever in the guide is now on the table. Baseline is given to you
        by the product. Confidence is a policy you set. Lift is the smallest
        win you care about. Sample size is the price you pay to see one. Three
        of those are inputs. Sample size is what falls out when you turn the
        other three.
      </p>

      <p className="mt-4 text-foreground/70">
        That&apos;s the calculator. The same chart you&apos;ve been pulling at
        for three chapters, with all four sliders live, and a number underneath
        that tells you how many visitors a test like this actually costs.
      </p>

      <SectionFooter
        summary={[
          "Minimum detectable effect is the smallest lift you want to be able to detect. It's a business call, not a stat.",
          "Smaller lifts pull B's bell toward A's and feed the false-negative region. Larger lifts pull the bells apart.",
          "Four levers shape the picture: baseline (given), confidence (policy), lift (business call), sample size (the price).",
          "Three are inputs. Sample size falls out.",
        ]}
        teaserText="Next: every lever, on one chart. The calculator."
        nextLabel="Open the calculator →"
        nextHref="/calculator"
      />
    </TutorialLayout>
  );
}
