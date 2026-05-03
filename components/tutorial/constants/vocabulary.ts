export const vocabulary = {
  average: "To be precise, we use the mean throughout this guide: the sum of all outcomes divided by the number of observations. In a conversion context it equals the conversion rate.",
  lift: "The percentage increase in conversion rate from A to B. This guide always uses the relative lift, not the absolute percentage-point gap. It is the minimum effect size we are looking for.",
  "true rate": "Technically, the true rate is a parameter of the popuulation. It is the conversion rate that would emerge if you could observe infinitely many visitors. Your baseline is an estimate of it.",
  "variability": "We use the standard deviation (sd) to measure variability. The sd is the typical width of a sampling distribution. One standard deviation from the mean captures roughly 68% of samples; two captures about 95%.",
  "default assumption": "We call this our Null Hypothesis (H₀). We assume that A and B are identical — there's no real effect. When a result is at or more extreme than the critical value, you're rejecting H₀: saying the outcome would be too improbable if A and B were truly the same, hence you declare a significant effect. If you don't have enough evidence, you fail to reject H₀, meaning you don't have enough evidence to say A and B are different.",
  "threshold": "Also called the critical value. This is the value on the x axis that separates the region where you would call an effect significant. The critical value is defined by your significance level.",
  "false positive": "This is your significance level. The fraction of A's bell that extends past the threshold by chance alone — written as alpha (α) in stats notations. At 95% confidence, α = 0.05. The confidence level is 1 − α. The two always sum to 1.",
};
