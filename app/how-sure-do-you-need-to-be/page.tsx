import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { Quote } from "@/components/tutorial/quote";
import { WidgetFrame } from "@/components/tutorial/widgets/widget-frame";
import { DecisionThresholdWidget } from "@/components/tutorial/widgets/decision-threshold-widget";
import { NormalVsExtremeWidget } from "@/components/tutorial/widgets/normal-vs-extreme-widget";
import { SideRemark } from "@/components/tutorial/side-remark";
import { getChapter, totalChapters } from "@/components/tutorial/chapters";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

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
          We now understand baseline and minimum detectable effect (lift). In this final chapter, we discuss how to determine when a result is definitive enough to act on.
          After this final chapter youll be ready to use the <Link href="/calculator">sample size calculator</Link> with full confidence.
        </p>

        <hr />

        <h2>Middle is normal, tails are rare</h2>

        <p>
          Lets think about why the bell shape is so common. It arises whenever you average a pile of yes/no outcomes — like the signup case study we started with, where each visitor either signed up or didn&apos;t.

          There is some variability. So when you run the experiment again and again, you get a spread of results. Most of the time, the average lands somewhere in the middle. Rarely, just by chance, you get a more extreme result (the tails).

          The spread of the bell — the {" "}<SideRemark term="variability" />{" "} — tells you how wide the spread is.

          Hover or click on the regions in the chart. How many experiments would be expected to land in each area?
        </p>

        <div className="not-prose mt-6">
          <WidgetFrame>
            <NormalVsExtremeWidget />
          </WidgetFrame>
        </div>

        <p>
          The key takeaway: samples deep in the tails are rare. If A and B were identical and you ran the experiment a hundred times, you would get a spread that is centered around A&apos;s mean.
          Only a handful would land out in the right tail. That rarity is what lets you call a winner.
        </p>

        <h2>Drawing the line: how far out is too rare to happen by chance?</h2>

        <p>
          Calling a winner means picking a point out past A&apos;s usual range
          and saying: anything that lands further out, and I&apos;ll believe B
          really is better. Anything short of it, and I&apos;ll stay with A.
        </p>

        <p> Move the slider in the widget. At which point is a conversion rate you are seeing from B so rare on the green curve (A, your control) that you would say: that can&apos;t be a coincidence?</p>

        <div className="not-prose mt-6">
          <WidgetFrame>
            <DecisionThresholdWidget />
          </WidgetFrame>
        </div>

        <p>
          Without getting into the specifics of statistics, the formal logic works like this: the <SideRemark term="threshold" /> is the
          cutoff point. If B&apos;s result lands past it, it is so extreme that you wouldn&apos;t expect to see it if A and B were actually identical—our {" "}
          <SideRemark term="default assumption" />.

          We then say that B is a winner and that we have a significant result.
        </p>

        <p>
          The threshold has a cost either way you move it.
        </p>

        <p>If you are less confident (you pull it towards A), you catch more real wins,
          because your sensitivity is higher. You are basically calling a winner earlier, even if the result is not so rare. The catch: more noise slips through.
          You are more likely to call a winner when there isn&apos;t one, simply because you are seeing a rare result that A produced by chance due to sampling error.
          We call that a {" "}<SideRemark term="false positive" />{" "}.</p>

        <p>On the other hand, if you feel more confident and move the threshold toward B, you filter out more noise — you are less likely to call a winner when there isn&apos;t one.
          But the catch is that you also miss more real wins, because the threshold is now further from A and A&apos;s natural variability is less likely to wander past it.
          Increasing your confidence will also need a bigger sample size as you&apos;ll see in the calculator. You are basically calling a winner only when the gap is larger, so you miss some of the smaller but still real lifts.</p>


        <h2>If A and B were the same, I accept being wrong 5% of the time</h2>

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
          A winner is a gap big enough that you would only see very rarely if A and B were really identical.
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

      <div className="mt-12 rounded-xl border border-accent/30 bg-accent/[0.06] px-8 py-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent/70">
          Guide complete
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          You now understand the three levers
        </h2>
        <ul className="mt-5 space-y-2">
          {[
            <><strong>Baseline</strong> — your starting conversion rate, given by your product.</>,
            <><strong>Minimum detectable effect</strong> — the smallest lift worth catching.</>,
            <><strong>Confidence</strong> — how strict you want to be about calling a winner.</>,
          ].map((item, i) => (
            <li key={i} className="flex gap-2 text-foreground/70">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-foreground/60">
          Put all three in and sample size is what falls out. The calculator does the math — you now know exactly what you&apos;re telling it and why.
        </p>
        <Link
          href="/calculator"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-background"
        >
          Open the calculator →
        </Link>
      </div>
    </TutorialLayout >
  );
}
