import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { CaseStudyCallout } from "@/components/tutorial/case-study-callout";
import { MarbleSamplingWidget } from "@/components/tutorial/marble-sampling-widget";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widget-frame";
import { JarIllustration } from "@/components/tutorial/jar-illustration";
import { getChapter, totalChapters } from "@/components/tutorial/chapters";
import { siteConfig } from "@/lib/site-config";

const chapter = getChapter(1);

export const metadata: Metadata = {
  title: chapter.browserTitle,
  description: chapter.description,
};

export default function Section1Page() {
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
        conversion rate of 20%: 2 in every 10, on average. Draw a sample of 10
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

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        The instinct vs. the reality
      </h2>
      <div className="mt-4 space-y-4 text-foreground/70">
        <p>
          Group B converted at 15%. Group A converted at 10%. That&apos;s a
          five-point gap, 50% better in relative terms. The data is right
          there. Of course you ship the winner.
        </p>
        <p>
          But at 100 visitors per group, the numbers are fragile. One signup
          either way moves the conversion rate by a full percentage point. The
          difference between &ldquo;10%&rdquo; and &ldquo;11%&rdquo; is a
          single person.
        </p>
        <p>
          Even two <em>identical</em> versions of your button, the exact same
          copy shown to equivalent audiences, would routinely produce a gap
          like 10 vs. 15 by pure chance at this sample size. Random variation
          at small scales is that large.
        </p>
      </div>

      <Quote>
        At 100 visitors per group, even two <em>identical</em> versions would
        routinely show a gap like this by pure chance.
      </Quote>

      <div className="space-y-4 text-foreground/70">
        <p>
          That means you cannot tell, from 100 visitors per group, whether B
          is genuinely better or you got lucky. Shipping on this evidence is a
          coin flip in a trenchcoat.
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
        nextHref="/how-many-visitors-do-you-need"
      />
    </TutorialLayout>
  );
}
