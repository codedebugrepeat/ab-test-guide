import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widgets/widget-frame";
import { LiftEffectWidget } from "@/components/tutorial/widgets/lift-effect-widget";
import { getChapter, totalChapters } from "@/components/tutorial/chapters";
import { siteConfig } from "@/lib/site-config";
import { CH2_LIFT } from "@/components/tutorial/constants/chapter-2-constants";

const chapter = getChapter(3);

export const metadata: Metadata = {
  title: chapter.browserTitle,
  description: chapter.description,
};

export default function Section3Page() {
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
          Chapter 2 ended with two bells side by side — A centered on the
          baseline, B shifted right by the lift, their overlap changing as you
          moved the slider. That picture posed a question: do the bells pull far
          enough apart to see a difference, or do they sit on top of each other
          and blend? This chapter is about the lever that controls the answer: the
          size of the lift you&apos;re hunting.
        </p>

        <hr />

        <h2>You choose what counts as a win</h2>

        <p>
          Before you run a test, you have to decide the smallest lift that would
          actually change what you ship. A 0.2% lift on checkout might be worth
          millions. A 0.2% lift on a corner of the app no one uses might not be
          worth the engineering follow-up. The number you settle on is your
          minimum detectable effect — shorthand for &ldquo;this is the smallest
          jump I want my test to be able to see.&rdquo;
        </p>

        <p>
          Tests don&apos;t hand this number back to you. It&apos;s an input. A
          product call dressed in stats clothing.
        </p>

        <h2>Smaller lifts hide. Bigger ones don&apos;t.</h2>

        <p>
          Here are the two bells from chapter 2. Drag the lift slider down and
          B&apos;s bell slides toward A&apos;s until the two are almost
          indistinguishable. Drag it up and the bells pull apart on their own.
        </p>

        <div className="not-prose mt-6">
          <WidgetFrame>
            <LiftEffectWidget showThreshold={false} />
          </WidgetFrame>
        </div>

        <p>
          At a 2% lift the bells almost coincide. You&apos;d need a very large
          sample before results from each group could reliably tell you which is
          ahead. Any single draw is noise.
        </p>
        <p>
          At a 50% lift the bells barely touch. The difference is large enough
          that even a modest sample shows B sitting clearly to the right of A.
          The lift is doing the work before the statistics have to.
        </p>
        <p>
          The case study&apos;s {CH2_LIFT * 100}% lift sits in the awkward middle — plenty of
          overlap, B&apos;s mean nudging out of A&apos;s range but not by much.
          That&apos;s why the case study has been a hard test all along: not
          because the stats are mean, but because the lift you&apos;re hunting
          is small.
        </p>

        <Quote>
          Aim small and you need a lot of data. Aim big and you might miss the
          win that was actually there.
        </Quote>

        <h2>Two levers in, one to go</h2>

        <p>
          You now have two inputs: baseline (given by your product) and lift
          (the smallest improvement worth chasing). Both shape how far apart the
          two bells sit. What the picture doesn&apos;t yet tell you is when a
          result is definitive enough to act on. That&apos;s the final lever —
          how strict you want to be about calling a winner.
        </p>
      </div>

      <SectionFooter
        summary={[
          "Minimum detectable effect is the smallest lift you want to be able to detect. It's a business call, not a stat.",
          "Small lifts push B's bell close to A's — the difference hides in the overlap. Large lifts pull the bells apart.",
          "You choose the lift before the test runs. The data can't tell you what's worth finding.",
        ]}
        teaserText="Next: the bells are set. Now draw the line that separates a real win from a lucky draw."
        nextLabel="Next: Confidence →"
        nextHref="/how-sure-do-you-need-to-be"
      />
    </TutorialLayout>
  );
}
