import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { CalculatorWidget } from "@/components/tutorial/widgets/calculator-widget";
import { AuthorCalloutInline } from "@/components/tutorial/author-callout";

export const metadata: Metadata = {
  title: "A/B Test Sample Size Calculator",
  description:
    "How many users do you need for your experiment? A pre-experiment calculator that turns baseline, lift, and confidence into a sample size.",
};

export default function CalculatorPage() {
  return (
    <Container>
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
        The finale
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        A/B test sample size calculator
      </h1>
      <p className="mt-6 text-lg text-foreground/70">
        How many users do you need for your experiment?
      </p>

      <div className="prose mt-6">
        <p>A quick recap of what shapes the sample size:</p>
        <ul>
          <li>
            <Link href="/your-baseline-matters" className="hover:text-foreground">
              Baseline
            </Link>
          </li>
          <li>
            <Link href="/how-big-a-jump-are-you-looking-for" className="hover:text-foreground">
              Lift (minimum detectable effect)
            </Link>
          </li>
          <li>
            <Link href="/how-sure-do-you-need-to-be" className="hover:text-foreground">
              Confidence
            </Link>
          </li>
        </ul>
        <p>
          This is a <strong>pre-experiment</strong> calculator. It helps you
          plan how many visitors you need before you launch, so your results
          have a fair shot at being statistically significant.
        </p>
      </div>

      <div className="not-prose mt-10">
        <CalculatorWidget />
      </div>

      <div className="prose mt-10">
        <p>
          Set your baseline conversion, the smallest effect worth detecting, and
          your confidence level. The visitors-per-variant number tells you how
          many people each side of your test needs before the math can reliably
          tell A from B.
        </p>
        <p>
          Halve the lift and the required visitors roughly quadruple. Push
          confidence from 95% to 99% and the threshold slides further out, so
          you need more visitors to clear it. The relationships you&apos;ve been
          reading off the chart now have numbers attached.
        </p>
      </div>

      <AuthorCalloutInline />
    </Container>
  );
}
