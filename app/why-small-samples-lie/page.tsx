import type { Metadata } from "next";
import { TutorialLayout } from "@/components/tutorial/tutorial-layout";
import { CaseStudyCallout } from "@/components/tutorial/case-study-callout";
import { MarbleSamplingWidget } from "@/components/tutorial/widgets/marble-sampling-widget";
import { SamplingDistributionBuilder } from "@/components/tutorial/widgets/sampling-distribution-builder";
import { Quote } from "@/components/tutorial/quote";
import { SectionFooter } from "@/components/tutorial/section-footer";
import { WidgetFrame } from "@/components/tutorial/widgets/widget-frame";
import { JarIllustration } from "@/components/tutorial/illustrations/jar-illustration";
import { SideRemark } from "@/components/tutorial/side-remark";
import { getChapter, totalChapters } from "@/components/tutorial/chapters";
import { siteConfig } from "@/lib/site-config";
import {
  CASE_STUDY_VISITORS,
  CASE_STUDY_A_SIGNUPS,
  CASE_STUDY_B_SIGNUPS,
  CASE_STUDY_A_RATE,
} from "@/components/tutorial/constants/case-study-constants";

const chapter = getChapter(1);

export const metadata: Metadata = {
  title: chapter.browserTitle,
  description: chapter.description,
};

export default function Section1Page() {
  const aPercent = Math.round(CASE_STUDY_A_RATE * 100);

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
          A/B testing needs a big enough sample. But how big?

          Most A/B test calculators hit you with a wall of jargon. In this guide, you&apos;ll learn how to think about sample size intuitively, so you can make informed decisions about your tests.
        </p>

        <p>
          This guide has interactive widgets you can play with to build your intuition.

          By the end, you&apos;ll master the three levers that matter — baseline, expected lift, and confidence — so you can find exactly how many visitors you need to run a test you can trust.
        </p>

        <p><strong>Let&apos;s start with the problem: small samples lie to you.</strong></p>

        <h2>Case Study</h2>

        <p>
          Let&apos;s imagine you have a website with a sign-up button and you want to get more sign-ups. So you&apos;re testing a copy change on your sign-up button and are running an A/B test. Version A is your original copy (&ldquo;Start your free trial&rdquo;), you showed this one to 100 visitors. Version B is the new version (&ldquo;Get started for free&rdquo;), which you showed to another 100 visitors.
        </p>

        <p>A couple days later, here is what you see in your dashboard:</p>

        <div className="not-prose">
          <CaseStudyCallout />
        </div>

        <h2>B seems to be better — but is it really?</h2>

        <p>
          Obviously, group B seems to be better. After all, it has more sign-ups. So should you make the change and ship it?
        </p>

        <p>
          This is a common instinct. But it&apos;s a trap.
        </p>

        <p>In your small sample size (100 users each), the difference you see might be due to random chance.</p>

        <Quote>
          At {CASE_STUDY_VISITORS} visitors per group, even two <em>identical</em> versions would
          routinely show a gap like this by pure chance.
        </Quote>

        <p>Let me explain.</p>

        <p>
          <strong>Imagine every potential visitor is a marble in a jar.</strong>{" "}
          Green means they signed up; gray means they didn&apos;t.
          In the jar below, 1 in every {Math.round(1 / CASE_STUDY_A_RATE)}{" "} marbles is green.

          So the jar&apos;s true rate of green marbles is {aPercent}%.

          We can&apos;t see inside the jar, but we can draw samples from it. We draw a handful of marbles and count how many are green. That gives us an estimate of the true rate of green marbles in the jar. If we draw enough samples, we can get a good picture of what the jar looks like on the inside.

          Now, in reality we wouldn&apos;t know what the exact true rate is, but let&apos;s pretend we do.
        </p>

        <div className="not-prose mt-6 flex justify-center">
          <JarIllustration />
        </div>

        <hr />

        <p>Ready for the first interactive demonstration?</p>
        <p>
          We will draw samples from the jar. Every draw takes 10 marbles out of the jar.
        </p>

        <p>We know the true rate in the jar is {aPercent}%. So on average, 2 in every {2 * Math.round(1 / CASE_STUDY_A_RATE)}{" "} marbles will be green.
        </p>

        <p> But what does a single sample look like?</p>

        <p>And what happens to the average if you draw again and again?</p>

        <p>Click &ldquo;Draw a sample&rdquo; to see for yourself.</p>

        <div className="not-prose">
          <WidgetFrame>
            <MarbleSamplingWidget />
          </WidgetFrame>
        </div>

        <h2>What you&apos;re really looking at: sampling error</h2>

        <p>What you just saw is <strong>sampling error</strong>: the natural
          spread in outcomes you get from a small random sample, even when
          nothing about the jar changed.
        </p>

        <Quote>The jar&apos;s truth didn&apos;t move. Your samples did.</Quote>

        <p>Some samples will have more green marbles than others.</p>

        <p>On average, you&apos;d expect 2 green marbles in each sample of 10. But sometimes you get 0, sometimes 1, and sometimes 3 or more. On average, you get two. The more samples you draw, the closer your average will be to the true rate.</p>

        <p>
          In our A/B test, the same thing happened. We had {CASE_STUDY_VISITORS} visitors per group, not 10 (so 10 times more). Still, getting {CASE_STUDY_A_SIGNUPS} on one &ldquo;draw&rdquo; and {CASE_STUDY_B_SIGNUPS} on another is pretty likely. The difference could easily be produced by sampling error alone. Even if there was no real difference in how visitors respond to the two button versions.
        </p>
        <p>
          Small samples are wobbly, large samples are more stable. If you take samples of 10 people and measure their size, a sample that was drawn from a basketball team might show that 9/10 people are extremely tall.
          Another sample of 10 people drawn from a random street might show that 0/10 people are extremely tall. The variability will be huge. The real answer - the true rate in the population - will be somewhere in between.
          The bigger your sample, the more likely your results will be closer to the true rate.
        </p>

        <h2>Stack the draws: a shape appears</h2>

        <p>
          As we saw, single draws bounce around. That&apos;s sampling error. But draw again.
          And again. Keep going and something happens: the chaos settles into a pattern.
        </p>

        <p>
          Below is the same marble jar with a true rate of {aPercent}% green marbles. This time, instead of seeing each marble in a row, the count of green marbles gets stacked onto the chart. Keep adding draws and a
          shape fills in.
        </p>

        <p>What do you think the shape will be? (Draw 10 or 100 samples to see it appear faster)</p>

        <div className="not-prose mt-6">
          <WidgetFrame>
            <SamplingDistributionBuilder />
          </WidgetFrame>
        </div>

        <p>
          That shape has a name: a <strong>sampling distribution</strong>. The
          middle is where most outcomes land; the edges are rare. At 10 marbles
          per draw the histogram is jagged, but the tendency is already there —
          results cluster around the jar&apos;s{" "}
          <SideRemark term="true rate" /> and thin out toward the extremes.
        </p>

        <p>We can use this knowledge to make better decisions about our A/B tests. Some results will be rather rare, so that we can be confident they&apos;re not due to chance.</p>

        <p>The rest of this guide will show you how to apply these principles to real-world A/B testing scenarios. Ready to learn more? →</p>
      </div>

      <SectionFooter
        summary={[
          `Small samples produce noisy results. If you see ${CASE_STUDY_A_SIGNUPS} vs. ${CASE_STUDY_B_SIGNUPS} out of 100 signups, you can't be certain if B is really better — or if you just got lucky with your sample.`,
          "Draw more samples (or larger samples) and you'll get closer to the true rate in the jar. In A/B testing, that means you can be more confident that your results reflect reality, not just random chance.",
        ]}
        teaserText="Now we know that small samples lie. So we want bigger samples. But how big? It depends on three things. Ready to find out what they are? →"
        nextLabel="Next: Your baseline matters →"
        nextHref="/your-baseline-matters"
      />
    </TutorialLayout>
  );
}
