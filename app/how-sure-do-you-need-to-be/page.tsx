import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widget-frame";
import { TwoBellsWidget } from "@/components/tutorial/two-bells-widget";
import { DecisionThresholdWidget } from "@/components/tutorial/decision-threshold-widget";
import { NormalVsExtremeWidget } from "@/components/tutorial/normal-vs-extreme-widget";
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

      <p className="mt-6 text-foreground/70">
        Chapter 2 left one bell on the chart: the control, drawn from a jar
        that converts at your baseline rate. Version B was there too, but only
        as a dashed line where its average would land. A line is not a
        distribution. B has its own spread, and until you draw it, you
        can&apos;t see the thing that actually decides whether a test calls a
        winner.
      </p>

      <hr className="my-10 border-foreground/10" />

      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Version B has its own bell
      </h2>

      <p className="mt-4 text-foreground/70">
        B is drawn from its own jar. If the new button really does lift signups
        by 10%, B&apos;s jar converts at 11% instead of 10%. Same sampling
        process, same sample size, same shape of noise. The bell sits in the
        same place on the chart, just shifted a little to the right.
      </p>

      <p className="mt-4 text-foreground/70">
        Here are both bells, side by side, at the case study&apos;s 10%
        baseline and 100 visitors per variant.
      </p>

      <div className="mt-6">
        <WidgetFrame>
          <TwoBellsWidget />
        </WidgetFrame>
      </div>

      <div className="mt-8 space-y-4 text-foreground/70">
        <p>
          The means pull apart by one percentage point. The bells, on the other
          hand, sprawl over something like five points each. A single run of
          the experiment gives you one dot from A&apos;s bell and one dot from
          B&apos;s bell. Depending on which way each lands, A can look better
          than B on any given day, even though B&apos;s jar really is the
          better one.
        </p>
        <p>
          That shaded sliver where the two bells sit on top of each other is
          the problem. Anywhere inside it, a sample from A and a sample from B
          are indistinguishable.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Slide the baseline and watch the overlap move
      </h2>

      <p className="mt-4 text-foreground/70">
        Take the baseline down to 2%. The lift is still 10% in relative terms,
        but the absolute gap between the two means is now a fifth of what it
        was. The bells almost sit on top of each other. Push the baseline up
        to 20% and the gap doubles, the bells separate, and the overlap
        shrinks to a thin band in the middle.
      </p>

      <p className="mt-4 text-foreground/70">
        Same relative improvement. Very different pictures. This is the same
        thread from chapter 2, now with both distributions on the chart
        instead of one bell and a line.
      </p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Middle is normal, tails are rare
      </h2>

      <p className="mt-4 text-foreground/70">
        Before we pick a line, look at where samples actually land. Every bell
        you&apos;ve drawn has the same shape for a reason. Most samples cluster
        near the true rate. Some land a bit off. Very few land far off.
        That&apos;s not a quirk of the signup case study; it&apos;s what
        happens any time you average a pile of yes/no outcomes.
      </p>

      <p className="mt-4 text-foreground/70">
        There&apos;s a tidy way to talk about &ldquo;near&rdquo; and
        &ldquo;far.&rdquo; A bell has a typical width, and statisticians call
        one unit of that width a <strong>standard deviation</strong>.
        It&apos;s a ruler you can lay across the chart. As a shape rule,
        roughly 68% of samples land within one standard deviation of the
        mean on either side, and roughly 95% within two. The remaining
        handful of percent live out in the tails, split between the two
        sides.
      </p>

      <div className="mt-6">
        <WidgetFrame>
          <NormalVsExtremeWidget />
        </WidgetFrame>
      </div>

      <p className="mt-4 text-foreground/70">
        Hold onto the rule of thumb. Middle of the bell means routine noise,
        the kind of result A produces all the time. Tails of the bell mean
        rare. A result out there is the sort of thing A only manages by
        accident once in a while. That difference is the whole basis for
        calling a winner.
      </p>

      <p className="mt-4 text-foreground/70">
        One thing to set aside before we keep going: the 68/95 numbers above
        describe the shape of a bell, looking at both tails together.
        They&apos;re a feel for the distribution, not the line we&apos;re
        about to draw. The decision line slices off only the right-hand
        tail, and the percentage attached to it is a different cut of the
        same bell. Don&apos;t conflate the two.
      </p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Where do you draw the line?
      </h2>

      <p className="mt-4 text-foreground/70">
        Calling a winner means picking a point out past A&apos;s usual range
        and saying: anything further out, and I&apos;ll believe B really is
        better. Anything short of it, and I&apos;ll stay with A.
      </p>

      <p className="mt-4 text-foreground/70">
        The line has a cost either way you move it. Pull it toward A and you
        catch more real wins, but you also catch some noise: runs where A got
        lucky and looked better than it is. Push it toward B and you filter
        the noise out, at the price of missing some genuine improvements
        because their samples landed on the wrong side of the line.
      </p>

      <div className="mt-6">
        <WidgetFrame>
          <DecisionThresholdWidget />
        </WidgetFrame>
      </div>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        Three names for the same line
      </h2>

      <p className="mt-4 text-foreground/70">
        The line you just moved around has names, and it&apos;s worth getting
        them straight before they show up everywhere else in the guide.
      </p>

      <p className="mt-4 text-foreground/70">
        Where the line sits on the x-axis is the <strong>critical value</strong>.
        The share of A&apos;s bell that stays to the left of it is your{" "}
        <strong>confidence level</strong>. The thin sliver of A&apos;s bell
        that pokes out to the right is the <strong>significance level</strong>.
        Confidence and significance always add to 100%, so picking one picks
        the other.
      </p>

      <p className="mt-4 text-foreground/70">
        A 95% confidence level is the standard default. Draw the line so 95%
        of A&apos;s bell sits to the left of it, and only a 5% sliver pokes
        out to the right. You&apos;ve said: I&apos;m willing to be fooled
        about 1 time in 20. If A and B were really the same and you ran this
        experiment over and over, A alone would wander past the line roughly
        5% of the time and look like a winner that wasn&apos;t there. That 5%
        is the significance level, spelled out.
      </p>

      <p className="mt-4 text-foreground/70">
        Note the line sits in A&apos;s right tail, not on both sides. We&apos;re
        hunting a lift: B is either enough better than A to clear the line, or
        it isn&apos;t. A suspiciously low sample from B isn&apos;t what this
        guide treats as a winner, so the left tail of A&apos;s bell stays out
        of the decision.
      </p>

      <p className="mt-4 text-foreground/70">
        Flip the framing and it&apos;s the same idea. If B really isn&apos;t
        any better than A, about 95 runs in 100 your test will sit tight and
        you&apos;ll be right to do so. The other 5, noise alone would push
        A&apos;s sample past the line and fool you into calling a winner.
        More confidence, fewer false alarms. Fewer false alarms, more data
        to get there.
      </p>

      <Quote>
        A winner is a gap big enough that you wouldn&apos;t see it by chance.
      </Quote>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight sm:text-3xl">
        What confidence actually costs
      </h2>

      <div className="mt-4 space-y-4 text-foreground/70">
        <p>
          Stricter confidence pushes the critical value further away from
          A&apos;s mean. Fewer false wins sneak through, which is the whole
          point. The catch is that the line now sits further from B&apos;s
          mean too, so a real lift has to be that much larger before it clears.
        </p>
        <p>
          At a fixed baseline and a fixed lift, more separation comes from
          one place: more visitors. More data tightens both bells, shrinks
          their spread, and lets a smaller real gap poke clear of a stricter
          line.
        </p>
      </div>

      <SectionFooter
        summary={[
          "Version B has its own sampling distribution, same shape as the control, shifted by the lift.",
          "Middle of a bell is routine noise. Tails are rare. Roughly 95% of samples land within two standard deviations of the mean.",
          "Calling a winner is drawing a critical value past A's usual range. The share of A's bell left of it is the confidence level; the sliver right of it is the significance level.",
          "Stricter confidence pushes the line further out, which needs more data to clear.",
        ]}
        teaserText="Next: the last lever. You've seen baseline and confidence shape the picture. The size of the jump you're hunting for shapes it too."
        nextLabel="Next: Effect size →"
        nextHref="/how-big-a-jump-are-you-looking-for"
      />
    </TutorialLayout>
  );
}
