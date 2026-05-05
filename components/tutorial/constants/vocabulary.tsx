import type { ReactNode } from "react";

export const vocabulary = {
  "average": (
    <>
      To be precise, we use the <strong>mean</strong> throughout this guide: the sum of all outcomes divided by the number of observations. In a conversion context it equals the conversion rate.
    </>
  ),
  "lift": (
    <>
      The percentage increase in conversion rate from A to B. This guide always uses the <strong>relative lift</strong>, not the absolute percentage-point gap. It is the minimum effect size we are looking for.
    </>
  ),
  "true rate": (
    <>
      Technically, the true rate is a <strong>parameter of the population</strong>. It is the conversion rate that would emerge if you could observe infinitely many visitors. Your baseline is an estimate of it.
    </>
  ),
  "variability": (
    <>
      We use the <strong>standard deviation</strong> (sd) to measure variability. The sd is the typical width of a sampling distribution. One standard deviation from the mean captures roughly 68% of samples; two captures about 95%.
    </>
  ),
  "default assumption": (
    <>
      We call this our <strong>Null Hypothesis</strong> (<em>H₀</em>). We assume that A and B are identical — there&rsquo;s no real effect. When a result is at the critical value (or further out), you&rsquo;re rejecting <em>H₀</em>: saying the outcome would be too improbable if A and B were truly the same, hence there must be a real effect. If you don&rsquo;t have enough evidence, you fail to reject <em>H₀</em>, meaning you don&rsquo;t have enough evidence to say A and B are different.
    </>
  ),
  "threshold": (
    <>
      Also called the <strong>critical value</strong>. This is the value on the x axis that separates the region where you would call an effect significant. The critical value is defined by your significance level.
    </>
  ),
  "false positive": (
    <>
      This is your <strong>significance level</strong>. The fraction of A&rsquo;s bell that extends past the threshold by chance alone — written as <em>α</em> in stats notation. At 95% confidence, <em>α</em> = 0.05. The confidence level is 1 − <em>α</em>. The two always sum to 1.
    </>
  ),
} satisfies Record<string, ReactNode>;
