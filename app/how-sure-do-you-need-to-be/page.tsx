import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widgets/widget-frame";
import { DecisionThresholdWidget } from "@/components/tutorial/widgets/decision-threshold-widget";
import { NormalVsExtremeWidget } from "@/components/tutorial/widgets/normal-vs-extreme-widget";
import { SideRemark } from "@/components/tutorial/side-remark";
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

      <div className="prose mt-6">
        <p>
          Chapter 3 ended with two bells — A centered on the baseline, B shifted
          right by the lift you&apos;re hunting. The picture shows whether those
          bells pull apart. What it doesn&apos;t tell you is when a result is
          definitive enough to act on. That&apos;s this chapter.
        </p>

        <hr />

        <h2>Middle is normal, tails are rare</h2>

        <p>
          Every bell you&apos;ve seen has the same property: most samples cluster
          near the true rate, some land a bit off, very few land far off.
          That&apos;s not a quirk of the signup case study — it&apos;s what
          happens any time you average a pile of yes/no outcomes. The spread of
          the bell — what statisticians call a{" "}
          <SideRemark term="standard deviation" /> — tells you how tight that
          clustering is.
        </p>

        <div className="not-prose mt-6">
          <WidgetFrame>
            <NormalVsExtremeWidget />
          </WidgetFrame>
        </div>

        <p>
          The key takeaway: samples deep in the tails are rare. If A and B were
          identical and you ran the experiment a hundred times, most results would
          sit comfortably near A&apos;s mean. Only a handful would land out in the
          right tail. That rarity is what lets you call a winner.
        </p>

        <h2>Drawing the line: how far out is too rare to happen by chance?</h2>

        <p>
          Calling a winner means picking a point out past A&apos;s usual range
          and saying: anything that lands further out, and I&apos;ll believe B
          really is better. Anything short of it, and I&apos;ll stay with A.
        </p>

        <p>
          The formal version of that logic: the threshold{" "}
          <SideRemark term="critical value" /> marks the point where a sample mean
          from B would be so extreme that, if A and B were truly identical —
          the{" "}
          <SideRemark term="null hypothesis" /> — you wouldn&apos;t expect to see
          it.
        </p>

        <p>
          The line has a cost either way you move it. Pull it toward A and you
          catch more real wins, but A&apos;s routine noise slips through more
          often. Push it toward B and you filter the noise out, at the price of
          missing some genuine improvements because their samples landed on the
          wrong side of the line.
        </p>

        <div className="not-prose mt-6">
          <WidgetFrame>
            <DecisionThresholdWidget />
          </WidgetFrame>
        </div>

        <h2>If A and B were the same, I accept being wrong 5% of the time</h2>

        <p>
          The thin piece of A&apos;s bell that sticks out to the right of the
          threshold is the <SideRemark term="significance level" /> — the
          probability that A alone, by pure chance, would wander past the line and
          fool you into calling a winner that wasn&apos;t there.
        </p>

        <p>
          The rest of A&apos;s bell — everything to the left of the threshold —
          is the confidence level. Significance and confidence always add to 100%,
          so picking one picks the other.
        </p>

        <p>
          A 95% confidence level is the standard default. You&apos;re saying:
          I&apos;ll accept being fooled about 1 time in 20. The threshold is
          drawn so that only a 5% sliver of A&apos;s bell pokes past it. If A
          and B were really identical and you ran this experiment over and over,
          A alone would wander past the line roughly 5% of the time and look like
          a winner that wasn&apos;t there.
        </p>

        <p>
          The threshold sits in A&apos;s right tail only. We&apos;re hunting a
          lift: B is either enough better than A to clear the line, or it
          isn&apos;t. A suspiciously low result from B doesn&apos;t count as a
          win, so the left tail stays out of the decision.
        </p>

        <Quote>
          A winner is a gap big enough that you wouldn&apos;t see it by chance.
        </Quote>

        <h2>What confidence actually costs</h2>

        <p>
          Stricter confidence pushes the threshold further from A&apos;s mean.
          Fewer false wins sneak through — which is the point. The catch: the
          threshold now sits further from B&apos;s mean too, so a real lift has
          to be that much larger before it clears.
        </p>
        <p>
          At a fixed baseline and a fixed lift, more separation comes from one
          place: more visitors. More data tightens both bells — less spread —
          so a smaller real gap can still poke clear of a strict threshold.
        </p>
        <p>
          That&apos;s the last lever. Baseline is given by your product.
          Lift is the smallest improvement worth chasing. Confidence is how
          strict you want to be about calling it. Put all three in and sample
          size is what falls out.
        </p>
      </div>

      <SectionFooter
        summary={[
          "Tails of A's bell are rare. A result there is the kind of thing A only produces by accident — that's the basis for calling a winner.",
          "The threshold is the line: anything past it, and you declare B the winner. The sliver of A's bell to the right is the significance level; everything to the left is the confidence level.",
          "Stricter confidence filters more noise but needs more data to clear.",
        ]}
        teaserText="You now have all three levers. See how they combine into a single sample-size number."
        nextLabel="Next: Calculator →"
        nextHref="/calculator"
      />
    </TutorialLayout>
  );
}
