import type { ReactNode } from "react";

export const vocabulary = {
  "average": (
    <>
      To be precise, we use the <strong>mean</strong> throughout this guide: the sum of all outcomes divided by the number of observations. In a conversion context it equals the conversion rate.
    </>
  ),
  "lift": (
    <>
      The percentage increase in conversion rate from A to B. This guide always uses the <strong>relative lift</strong>, not the absolute percentage-point gap. When planning a test, we pick a target lift — the smallest improvement we want the test to be able to detect.
    </>
  ),
  "true rate": (
    <>
      Technically, the true rate is a <strong>parameter of the population</strong>. It is the conversion rate that would emerge if you could observe infinitely many visitors. Your baseline is an estimate of it.
    </>
  ),
  "variability": (
    <>
      We use the <strong>standard deviation</strong> (sd) to measure variability. The sd is the typical width of a sampling distribution. Assuming a normal distribution (which we usually do, and which the bell curves in this guide show), about 68% of values fall within one sd of the mean and about 95% within two.
    </>
  ),
  "default assumption": (
    <>
      We call this our <strong>Null Hypothesis</strong> (<em>H₀</em>). We assume that A and B are identical — there&rsquo;s no real effect. When a result is at the critical value (or further out), you&rsquo;re rejecting <em>H₀</em>: the outcome would be too improbable if A and B were truly the same, so we conclude the difference is unlikely to be just chance. If you don&rsquo;t have enough evidence, you fail to reject <em>H₀</em> — that doesn&rsquo;t prove A and B are equal, only that you can&rsquo;t tell them apart from this data.
    </>
  ),
  "threshold": (
    <>
      Also called the <strong>critical value</strong>. This is the value on the x axis that separates the region where you would call an effect significant. The critical value is defined by your significance level.
    </>
  ),
  "false positive": (
    <>
      A <strong>false positive</strong> (a <em>Type I error</em>) is calling B a winner when A and B are really identical — fooled by chance. The <strong>significance level</strong> (<em>α</em>) is the cap we set on how often we&rsquo;ll tolerate this: if A and B were truly the same and you re-ran the experiment forever, only a fraction <em>α</em> of those runs would falsely declare a winner. That&rsquo;s the slice of A&rsquo;s bell poking past the threshold. At 95% confidence, <em>α</em> = 0.05. The confidence level is 1 − <em>α</em>; the two always sum to 1.
    </>
  ),
} satisfies Record<string, ReactNode>;
