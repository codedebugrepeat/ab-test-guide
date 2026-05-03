import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widgets/widget-frame";
import { LiftEffectWidget } from "@/components/tutorial/widgets/lift-effect-widget";
import { getChapter, totalChapters } from "@/components/tutorial/chapters";
import { siteConfig } from "@/lib/site-config";

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
          In chapter 2, we learned why your baseline conversion rate matters. The size of the change you&apos;re looking for matters too.
          Let&apos;s look at why that is.
        </p>

        <hr />

        <h2>You choose how big a jump you want to detect</h2>

        <p>
          Before you run a test, you have to decide the smallest lift that would
          actually change what you ship. This is often called the minimum detectable effect.
        </p>

        <p>If you want to detect small changes, you&apos;ll need a larger sample size to see a significant difference.</p>

        <p>However, if you are ok with a larger lift, you can get away with a smaller sample size.</p>

        <p>There is no right answer to this question — it depends on your product, your goals, and your resources.
          A 2% relative improvement in a checkout might be worth millions. On the other hand, a 20% improvement in an unused feature might not be worth your time.</p>

        <h2>Smaller lifts hide. Bigger ones don&apos;t.</h2>

        <p>
          Here are the two bells from chapter 2 again. Drag the slider to change the percentage improvement and see what happens.
        </p>

        <div className="not-prose mt-6">
          <WidgetFrame>
            <LiftEffectWidget showThreshold={false} />
          </WidgetFrame>
        </div>

        <p>
          At a 2% lift the bells overlap heavily. You&apos;d need a very large
          sample before results from each group could reliably tell you which is
          ahead. Any single draw is noise.
        </p>
        <p>
          However, at a 50% lift the bells barely touch. The difference is large enough
          that even a modest sample shows B sitting clearly to the right of A.
          The lift is doing the work before the statistics have to.
        </p>

        <Quote>
          Aim small and you need a lot of data. Aim too big and you might miss a real win.
        </Quote>

        <h2>Two levers in, one to go</h2>

        <p>
          You now have two inputs: baseline (your current conversion rate) and lift / minimum detectable effect (the smallest improvement worth chasing).
          Both shape how far apart the two bells sit. So the further apart the bells, the easier it is to tell them apart with a given sample size.
          The question becomes, how &ldquo;extreme&rdquo; does your variation (Group B) have to be before you will declare it a winner?
        </p>

        <p>We&apos;ll look at this in the final chapter. It&apos;s called confidence level, and is the last piece of the puzzle.</p>
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
